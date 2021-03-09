import '@aws-cdk/assert/jest';

import { Vpc } from '@aws-cdk/aws-ec2';
import { CfnFunction } from '@aws-cdk/aws-lambda';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from '@aws-cdk/aws-rds';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { App, Stack } from '@aws-cdk/core';
import { DatabaseScript } from '../src';

describe('DatabaseUser', () => {
  let app: App;
  let stack: Stack;
  let vpc: Vpc;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'test-stack');
    vpc = new Vpc(stack, 'test-vpc', {});
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
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [
          'SingletonLambdatestconstructtestdbServiceRole6B2FC052',
          'Arn',
        ],
      },
      Environment: {
        Variables: {
          ENGINE: 'mysql',
          SECRET_ARN: {
            Ref: 'testdbSecretAttachmentA0E468D9',
          },
          DATABASE_HOST: {
            'Fn::GetAtt': [
              'testdb9A2744AA',
              'Endpoint.Address',
            ],
          },
          DATABASE_PORT: {
            'Fn::GetAtt': [
              'testdb9A2744AA',
              'Endpoint.Port',
            ],
          },
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
      },
      Handler: 'index.handler',
      Runtime: 'nodejs12.x',
      Timeout: 60,
      VpcConfig: {
        SecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'SingletonLambdatestconstructtestdbSecurityGroup8F79B3EC',
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
      },
    });
  });

  it('Creates Lambda using given secret if not provided', () => {
    createStack({
      secret: new Secret(stack, 'secret', {}),
    });
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [
          'SingletonLambdatestconstructtestdbServiceRole6B2FC052',
          'Arn',
        ],
      },
      Environment: {
        Variables: {
          ENGINE: 'mysql',
          SECRET_ARN: {
            Ref: 'secret4DA88516',
          },
          DATABASE_HOST: {
            'Fn::GetAtt': [
              'testdb9A2744AA',
              'Endpoint.Address',
            ],
          },
          DATABASE_PORT: {
            'Fn::GetAtt': [
              'testdb9A2744AA',
              'Endpoint.Port',
            ],
          },
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
      },
      Handler: 'index.handler',
      Runtime: 'nodejs12.x',
      Timeout: 60,
      VpcConfig: {
        SecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'SingletonLambdatestconstructtestdbSecurityGroup8F79B3EC',
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
      },
    });
  });

  it('Lambda Permissions are correct', () => {
    createStack();
    expect(stack).toHaveResource('AWS::IAM::Policy', {
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
      PolicyName: 'SingletonLambdatestconstructtestdbServiceRoleDefaultPolicyA1376FC8',
      Roles: [
        {
          Ref: 'SingletonLambdatestconstructtestdbServiceRole6B2FC052',
        },
      ],
    });
  });

  it('Custom Resource is right', () => {
    createStack();
    expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
      ServiceToken: {
        'Fn::GetAtt': [
          'SingletonLambdatestconstructtestdb714CC002',
          'Arn',
        ],
      },
      script: 'SELECT * FROM table',
    });
  });

  it('doesn\'t force a dependency for the databaseInstance stack if different', () => {

    const testDatabaseInstance = new DatabaseInstance(stack, 'testdb', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_21 }),
      vpc,
    });

    const secondStack = new Stack(app);
    new DatabaseScript(secondStack, 'test-construct', {
      databaseInstance: testDatabaseInstance,
      script: 'SELECT * FROM table',
      secret: testDatabaseInstance.secret,
    });

    expect(stack).not.toHaveResource('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'from teststackSingletonLambdatestconstructSecurityGroupB05F5552:{IndirectPort}',
      FromPort: {
        'Fn::GetAtt': [
          'testdb9A2744AA',
          'Endpoint.Port',
        ],
      },
      GroupId: {
        'Fn::GetAtt': [
          'testdbSecurityGroup7744B8EE',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'SingletonLambdatestconstructSecurityGroup41C6411D',
          'GroupId',
        ],
      },
      ToPort: {
        'Fn::GetAtt': [
          'testdb9A2744AA',
          'Endpoint.Port',
        ],
      },
    });

    expect(secondStack).toHaveResource('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'access from lambda handler to database',
      FromPort: {
        'Fn::ImportValue': 'test-stack:ExportsOutputFnGetAtttestdb9A2744AAEndpointPort44CC01FA',
      },
      GroupId: {
        'Fn::ImportValue': 'test-stack:ExportsOutputFnGetAtttestdbSecurityGroup7744B8EEGroupId25B1B86D',
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'SingletonLambdatestconstructtestdbSecurityGroup8F79B3EC',
          'GroupId',
        ],
      },
      ToPort: {
        'Fn::ImportValue': 'test-stack:ExportsOutputFnGetAtttestdb9A2744AAEndpointPort44CC01FA',
      },
    });
  });

  it('uses connections when in the same stack', () => {
    createStack();
    expect(stack).toHaveResource('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'from teststackSingletonLambdatestconstructtestdbSecurityGroup974E0E5B:{IndirectPort}',
      FromPort: {
        'Fn::GetAtt': [
          'testdb9A2744AA',
          'Endpoint.Port',
        ],
      },
      GroupId: {
        'Fn::GetAtt': [
          'testdbSecurityGroup7744B8EE',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'SingletonLambdatestconstructtestdbSecurityGroup8F79B3EC',
          'GroupId',
        ],
      },
      ToPort: {
        'Fn::GetAtt': [
          'testdb9A2744AA',
          'Endpoint.Port',
        ],
      },
    });
  });

  it('lambda is specific to the database', () => {
    createStack();
    const lambda = stack.node.findAll().find(x => (x as CfnFunction).cfnResourceType === 'AWS::Lambda::Function' && x.node.id === 'Resource');
    expect(lambda!.node.uniqueId.includes('testdb')).toBeTruthy();
  });
});