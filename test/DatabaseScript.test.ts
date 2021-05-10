import '@aws-cdk/assert/jest';

import { Port, SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import { CfnFunction } from '@aws-cdk/aws-lambda';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from '@aws-cdk/aws-rds';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { App, Stack } from '@aws-cdk/core';
import { DatabaseScript } from '../src';

describe('DatabaseUser', () => {
  let app: App;
  let stack: Stack;
  let vpc: Vpc;

  // standard responses
  const role = {
    'Fn::GetAtt': [
      'testconstructtestdbsinglServiceRole6B7C76BD',
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
          'testconstructtestdbsinglSecurityGroup59C76A1D',
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
    expect(stack).toHaveResource('AWS::Lambda::Function', {
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
      PolicyName: 'testconstructtestdbsinglServiceRoleDefaultPolicyFC217E5C',
      Roles: [
        {
          Ref: 'testconstructtestdbsinglServiceRole6B7C76BD',
        },
      ],
    });
  });

  it('Custom Resource is right', () => {
    createStack();
    expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
      ServiceToken: {
        'Fn::GetAtt': [
          'testconstructtestdbsinglDCE93DA6',
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

    new DatabaseScript(stack, 'test-construct', {
      databaseInstance: testDatabaseInstance,
      script: 'SELECT * FROM table',
      secret: testDatabaseInstance.secret,
    }).bind(new SecurityGroup(stack, 'sg12', { vpc }), Port.tcp(1433));

    expect(stack).toHaveResource('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'access from Lambda testconstructtestdbsingl',
      FromPort: 1433,
      GroupId: {
        'Fn::GetAtt': [
          'sg123BFB086F',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'testconstructtestdbsinglSecurityGroup59C76A1D',
          'GroupId',
        ],
      },
      ToPort: 1433,
    });
  });

  it('lambda is specific to the database', () => {
    createStack();
    const lambda = stack.node.findAll().find(x => (x as CfnFunction).cfnResourceType === 'AWS::Lambda::Function' && x.node.id === 'Resource');
    expect(lambda!.node.uniqueId.includes('testdb')).toBeTruthy();
  });
});