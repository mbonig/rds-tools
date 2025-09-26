import { Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Code, CodeConfig } from 'aws-cdk-lib/aws-lambda';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from 'aws-cdk-lib/aws-rds';
import { App, Stack } from 'aws-cdk-lib/core';
import { DatabaseScript } from '../src';

describe('DatabaseUser', () => {
  let app: App;
  let stack: Stack;
  let vpc: Vpc;


  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'test-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    vpc = new Vpc(stack, 'test-vpc', {});
  });

  let fromAssetMock: jest.SpyInstance;

  beforeAll(() => {
    fromAssetMock = jest.spyOn(Code, 'fromAsset').mockReturnValue({
      isInline: false,
      bind: (): CodeConfig => {
        return {
          s3Location: {
            bucketName: 'my-bucket',
            objectKey: 'my-key',
          },
        };
      },
      bindToResource: () => {
        return;
      },
    } as any);
  });

  afterAll(() => {
    fromAssetMock?.mockRestore();
  });


  function createStack(props: any = {}) {
    const testDatabaseInstance = new DatabaseInstance(stack, 'testdb', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_21 }),
      vpc,
    });
    const databaseScript = new DatabaseScript(stack, 'test-construct', {
      databaseInstance: testDatabaseInstance,
      script: 'SELECT * FROM table',
      secret: testDatabaseInstance.secret,
      ...props,
    });

    testDatabaseInstance.connections.allowDefaultPortFrom(databaseScript);

    // Make sure the script runs after the database is created
    databaseScript.node.addDependency(testDatabaseInstance);
    return stack;
  }

  it('Creates Lambda function', () => {
    createStack();
    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs22.x',
      Timeout: 15,
    });
  });

  it('Creates Custom Resource', () => {
    createStack();
    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::CloudFormation::CustomResource', {
      script: 'SELECT * FROM table',
    });
  });

  it('Creates log group', () => {
    createStack();
    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 1,
    });
  });

  it('sanitizes log group names with special characters', () => {
    // Use names with various special characters that should be removed/sanitized
    const testDatabaseInstance = new DatabaseInstance(stack, 'test@db$with%invalid&chars', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_21 }),
      vpc,
    });

    const databaseScript = new DatabaseScript(stack, 'test-construct@with%invalid&chars', {
      databaseInstance: testDatabaseInstance,
      script: 'SELECT * FROM table',
      secret: testDatabaseInstance.secret,
    });

    testDatabaseInstance.connections.allowDefaultPortFrom(databaseScript);

    const assert = Template.fromStack(stack);

    // Get the log group from the template
    const logGroups = assert.findResources('AWS::Logs::LogGroup');
    const logGroupIds = Object.keys(logGroups);

    // Verify that log group IDs only contain valid characters
    // AWS Lambda LogGroup pattern: [\.\-_/#A-Za-z0-9]+
    const validPattern = /^[.\-_/#A-Za-z0-9]+$/;

    logGroupIds.forEach(logGroupId => {
      expect(logGroupId).toMatch(validPattern);
      // Make sure invalid characters like @, $, %, & are not present
      expect(logGroupId).not.toMatch(/[@$%&]/);
    });

    // Test the actual log group name that will be used in Lambda LoggingConfig
    const lambdaFunctions = assert.findResources('AWS::Lambda::Function');
    const lambdaIds = Object.keys(lambdaFunctions);

    lambdaIds.forEach(lambdaId => {
      const lambda = lambdaFunctions[lambdaId];
      if (lambda.Properties?.LoggingConfig?.LogGroup) {
        const logGroupRef = lambda.Properties.LoggingConfig.LogGroup;
        // Check if it's a Ref reference (for logGroupName)
        if (logGroupRef.Ref) {
          const logGroupResourceId = logGroupRef.Ref;
          // This should match our pattern since it's the CDK construct ID
          expect(logGroupResourceId).toMatch(validPattern);
          expect(logGroupResourceId).not.toMatch(/[@$%&]/);
        }
      }
    });

    assert.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 1,
    });
  });

});
