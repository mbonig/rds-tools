import { Template } from 'aws-cdk-lib/assertions';
import { Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Code, CodeConfig } from 'aws-cdk-lib/aws-lambda';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { App, Stack } from 'aws-cdk-lib/core';
import { DatabaseScript } from '../src';

describe('DatabaseUser', () => {
  let app: App;
  let stack: Stack;
  let vpc: Vpc;

  // standard responses
  const role = {
    'Fn::GetAtt': [
      'testdbcrsinglServiceRoleD215FB7C',
      'Arn',
    ],
  };

  const variables = {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
  };
  const environment = {
    Variables: variables,
  };
  const vpcConfig = {

    SecurityGroupIds: [
      {
        'Fn::GetAtt': [
          'testdbcrsinglSecurityGroup42F73B8E',
          'GroupId',
        ],
      },
    ],
    SubnetIds: [
      {
        Ref: 'testvpcPrivateSubnet1Subnet865FB50A',
      },
      {
        Ref: 'testvpcPrivateSubnet2Subnet23D3396F',
      },
    ],
  };

  const commonProps = {
    Role: role,
    Environment: environment,
    Handler: 'index.handler',
    Runtime: 'nodejs12.x',
    Timeout: 15,
    VpcConfig: vpcConfig,
  };


  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'test-stack');
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
    new DatabaseScript(stack, 'test-construct', {
      databaseInstance: testDatabaseInstance,
      script: 'SELECT * FROM table',
      secret: testDatabaseInstance.secret,
      ...props,
    });
    return stack;
  }

  it('Creates Lambda using db root secret', () => {
    createStack();

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::Lambda::Function', {
      ...commonProps,
      Environment: {
        Variables: {
          ...variables,
          SECRET_ARN: {
            Ref: 'testdbSecretAttachmentA0E468D9',
          },
        },
      },
    });
  });

  it('Creates Lambda using given secret if not provided', () => {
    createStack({
      secret: new Secret(stack, 'secret', {}),
    });
    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::Lambda::Function', {
      ...commonProps,
      Environment: {
        Variables: {
          ...variables,
          SECRET_ARN: {
            Ref: 'secret4DA88516',
          },
        },
      },
    });
  });

  it('Lambda Permissions are correct', () => {
    createStack();
    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'testdbSecretAttachmentA0E468D9',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testdbcrsinglServiceRoleDefaultPolicy249C0A03',
      Roles: [
        {
          Ref: 'testdbcrsinglServiceRoleD215FB7C',
        },
      ],
    });
  });

  it('Custom Resource is right', () => {
    createStack();
    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::CloudFormation::CustomResource', {
      ServiceToken: {
        'Fn::GetAtt': [
          'testdbcrsinglB417086D',
          'Arn',
        ],
      },
      script: 'SELECT * FROM table',
    });
  });

  it('Creates adhoc lambda', ()=>{
    createStack({ enableAdhoc: true });

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::Lambda::Function', {
      ...commonProps,
      Environment: {
        Variables: {
          ...variables,
          SECRET_ARN: {
            Ref: 'testdbSecretAttachmentA0E468D9',
          },
        },
      },
    });
  });

  it('doesn\'t force a dependency for the databaseInstance stack if different', () => {

    const testDatabaseInstance = new DatabaseInstance(stack, 'testdb', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_21 }),
      vpc,
    });

    new DatabaseScript(stack, 'test-construct', {
      databaseInstance: testDatabaseInstance,
      script: 'SELECT * FROM table',
      secret: testDatabaseInstance.secret,
    }).bind(new SecurityGroup(stack, 'sg12', { vpc }), Port.tcp(1433));

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'access from Lambda testdbcrsingl',
      FromPort: 1433,
      GroupId: {
        'Fn::GetAtt': [
          'sg123BFB086F',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'testdbcrsinglSecurityGroup42F73B8E',
          'GroupId',
        ],
      },
      ToPort: 1433,
    });
  });

});