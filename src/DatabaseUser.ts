import * as path from 'path';
import { Port, SecurityGroup } from '@aws-cdk/aws-ec2';
import { Rule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { DatabaseInstance } from '@aws-cdk/aws-rds';
import { ISecret, Secret } from '@aws-cdk/aws-secretsmanager';
import { Construct, CustomResource, Duration } from '@aws-cdk/core';

export interface DatabaseUserProps {
  /**
   * Secret is given name `${secretNamePrefix}${username}`
   */
  readonly secretNamePrefix?: string;

  /**
   * The database instance endpoint in RDS.
   */
  readonly databaseInstance: DatabaseInstance;

  /**
   *  databases the user will have access
   *
   *  @example ["customer", "orders", "invoices"]
   */
  readonly databases: string[];

  /**
   * An optional Secret for accessing the database.
   *
   * @default The root secret from the database instance
   */
  readonly masterSecret?: ISecret;

  /**
   * The username to create
   */
  readonly username: string;
}

/**
 * Create a user on a database.
 *
 * Can probably be merged with the DatabaseScript construct
 */
export class DatabaseUser extends Construct {
  public secret: Secret;

  constructor(scope: Construct, id: string, props: DatabaseUserProps) {
    super(scope, id);

    // set up user secret
    const secretName = `${props.secretNamePrefix}${props.username}`;
    const userSecret = new Secret(this, `${id}-user-secret`, {
      secretName: secretName,
      generateSecretString: {
        passwordLength: 20,
        excludePunctuation: true,
        secretStringTemplate: JSON.stringify({
          username: props.username,
          password: '',
          host: props.databaseInstance.dbInstanceEndpointAddress,
        }),
        generateStringKey: 'password',
      },
    });
    this.secret = userSecret;

    // set up master secret
    const masterSecret = props.masterSecret || props.databaseInstance.secret!;

    // create lambda
    const userManagementFunction = new NodejsFunction(this, 'db-user-creator', {
      entry: path.join(__dirname, 'handlers', 'database-user.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_12_X,
      vpc: props.databaseInstance.vpc,
      environment: {
        MASTER_SECRET_ARN: masterSecret.secretArn,
        SOURCE_SECRET_NAME: userSecret.secretName,
      },
      bundling: {
        nodeModules: ['mssql'],
      },
      timeout: Duration.seconds(60),
      logRetention: RetentionDays.ONE_DAY,
    });

    // grant lambdas access to the secrets
    masterSecret.grantRead(userManagementFunction);
    userSecret.grantRead(userManagementFunction);

    // setup DB connection
    // todo: can this be done without the database stack taking a dependency on this?
    const sgRef = SecurityGroup.fromSecurityGroupId(this, 'db-sg', props.databaseInstance.connections.securityGroups[0].securityGroupId);
    sgRef.connections.allowFrom(userManagementFunction, Port.tcp(1366));

    // setup the EventBridge rule for  listening to the secret
    const rule = new Rule(this, 'database-password-updater-rule', {
      eventPattern: {
        source: [
          'aws.secretsmanager',
        ],
        detail: {
          requestParameters: {
            secretId: [secretName],
          },
        },
      },
    });

    rule.addTarget(new LambdaFunction(userManagementFunction));

    // finally, the CR
    new CustomResource(this, `${id}-customResource`, {
      serviceToken: userManagementFunction.functionArn,
      properties: {
        databases: props.databases,
        secretForUser: userSecret.secretArn,
      },
    });
  }
}