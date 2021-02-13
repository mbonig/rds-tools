import '@aws-cdk/assert/jest';

import { Vpc } from '@aws-cdk/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from '@aws-cdk/aws-rds';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { App, Stack } from '@aws-cdk/core';
import { DatabaseUser } from '../src';

describe('DatabaseUser', () => {
  let stack: Stack;
  let vpc: Vpc;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    vpc = new Vpc(stack, 'test-vpc', {});
  });

  function createStack(props: any = {}) {
    const testDatabaseInstance = new DatabaseInstance(stack, 'testdb', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_21 }),
      vpc,
    });
    new DatabaseUser(stack, 'test-construct', {
      databaseInstance: testDatabaseInstance,
      databases: ['thingone'],
      secretNamePrefix: 'db/',
      username: 'app',
      masterSecret: props?.masterSecret,
    });
    return stack;
  }

  it('Creates Lambda using db root secret', () => {
    createStack();
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          MASTER_SECRET_ARN: {
            Ref: 'testdbSecretAttachmentA0E468D9',
          },
          SOURCE_SECRET_NAME: {
            'Fn::Select': [
              6,
              {
                'Fn::Split': [
                  ':',
                  {
                    Ref: 'testconstructtestconstructusersecret1626A6D1',
                  },
                ],
              },
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
              'testconstructdbusercreatorSecurityGroup7703290D',
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

  it('Creates Lambda using given PowerSecret if not provided', () => {
    createStack({
      masterSecret: new Secret(stack, 'secret', {}),
    });
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          MASTER_SECRET_ARN: {
            Ref: 'secret4DA88516',
          },
          SOURCE_SECRET_NAME: {
            'Fn::Select': [
              6,
              {
                'Fn::Split': [
                  ':',
                  {
                    Ref: 'testconstructtestconstructusersecret1626A6D1',
                  },
                ],
              },
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
              'testconstructdbusercreatorSecurityGroup7703290D',
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

  it('User secret has correct name', () => {
    createStack();
    expect(stack).toHaveResource('AWS::SecretsManager::Secret', {
      Name: 'db/app',
    });
  });

  it('User secret generation', () => {
    createStack();
    expect(stack).toHaveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludePunctuation: true,
        GenerateStringKey: 'password',
        PasswordLength: 20,
        SecretStringTemplate: {
          'Fn::Join': [
            '',
            [
              '{"username":"app","password":"","host":"',
              {
                'Fn::GetAtt': [
                  'testdb9A2744AA',
                  'Endpoint.Address',
                ],
              },
              '"}',
            ],
          ],
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
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'testconstructtestconstructusersecret1626A6D1',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  it('Creates Rule', () => {
    createStack();
    expect(stack).toHaveResource('AWS::Events::Rule', {
      EventPattern: {
        source: [
          'aws.secretsmanager',
        ],
        detail: {
          requestParameters: {
            secretId: [
              'db/app',
            ],
          },
        },
      },
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'testconstructdbusercreatorABCD1B4E',
              'Arn',
            ],
          },
          Id: 'Target0',
        },
      ],
    });
  });

  it('Custom Resource is right', () => {
    createStack();
    expect(stack).toHaveResource('AWS::CloudFormation::CustomResource', {
      ServiceToken: {
        'Fn::GetAtt': [
          'testconstructdbusercreatorABCD1B4E',
          'Arn',
        ],
      },
      databases: [
        'thingone',
      ],
      secretForUser: {
        Ref: 'testconstructtestconstructusersecret1626A6D1',
      },
    });
  });
});