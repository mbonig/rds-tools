import * as path from 'path';
import { CfnSecurityGroupIngress } from '@aws-cdk/aws-ec2';
import { slugify } from '@aws-cdk/aws-ec2/lib/util';
import { FunctionBase, IFunction, Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from '@aws-cdk/aws-lambda-nodejs';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { DatabaseInstance } from '@aws-cdk/aws-rds';
import { ISecret } from '@aws-cdk/aws-secretsmanager';
import { Construct, CustomResource, Duration, Stack } from '@aws-cdk/core';

interface DatabaseScriptProps {
  /**
   * The database instance to run the script against
   */
  readonly databaseInstance: DatabaseInstance;

  /**
   * An optional secret that provides credentials for the database. Must have fields 'username' and 'password'
   *
   * @default the root secret from the database instance
   */
  readonly secret?: ISecret;

  /**
   * The script to execute.
   */
  readonly script: string;
}

export class DatabaseScript extends Construct {

  constructor(scope: Construct, id: string, props: DatabaseScriptProps) {
    super(scope, id);

    const secret = props.secret || props.databaseInstance.secret;
    if (!secret) {
      throw new Error('You must either provide a secret or there must be one available on the databaseInstance');
    }

    const handler = this.ensureLambda(`${id}-${props.databaseInstance.node.id}`, {
      entry: path.join(__dirname, 'handlers', 'script-runner.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_12_X,
      vpc: props.databaseInstance.vpc,
      environment: {
        SECRET_ARN: secret.secretArn,
        DATABASE_HOST: props.databaseInstance.dbInstanceEndpointAddress, // is it better to get these from the secret?
        DATABASE_PORT: props.databaseInstance.dbInstanceEndpointPort,
        ENGINE: props.databaseInstance.engine?.engineType!,
      },
      bundling: {
        nodeModules: ['mssql'],
      },
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_DAY,
    });

    secret.grantRead(handler);
    if (Stack.of(props.databaseInstance) === Stack.of(this)) {
      props.databaseInstance.connections.allowDefaultPortFrom(handler);
    } else {
      // https://www.youtube.com/watch?v=EzWNBmjyv7Y
      new CfnSecurityGroupIngress(this, 'SecurityGroupIngressFrom', {
        // @ts-ignore
        fromPort: props.databaseInstance.dbInstanceEndpointPort,
        // @ts-ignore
        toPort: props.databaseInstance.dbInstanceEndpointPort,
        groupId: props.databaseInstance.connections.securityGroups[0].securityGroupId,
        sourceSecurityGroupId: handler.connections.securityGroups[0].securityGroupId,
        ipProtocol: 'tcp',
        description: 'access from lambda handler to database',
      });
    }

    new CustomResource(this, `${id}-customResource`, {
      serviceToken: handler.functionArn,
      properties: {
        script: props.script,
      },
    });
  }


  private ensureLambda(id: string, props: NodejsFunctionProps): IFunction {
    // TODO: Copy-pasted from CDK codebase until
    //       https://github.com/aws/aws-cdk/issues/6261 is fixed and we can
    //       use a proper SingletonFunction
    const constructName = 'SingletonLambda' + slugify(id);
    const existing = Stack.of(this).node.tryFindChild(constructName);
    if (existing) {
      return existing as FunctionBase;
    }
    return new NodejsFunction(Stack.of(this), constructName, props);
  }
}