// eslint-disable-next-line @typescript-eslint/no-require-imports
import { IProvider } from './provider';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AWS = require('aws-sdk');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const response = require('./cfn-response');

export const getProvider = (props: {
  username: string;
  password: string;
  host: string;
  databaseName?: string;
  engine: string;
  port?: string;
}): IProvider => {
  const commonProps = {
    host: props.host,
    port: props.port,
    username: props.username,
    password: props.password,
    databaseName: props.databaseName,
  };

  switch (props.engine) {
    case 'sqlserver':
    case 'sqlserver-se':
    case 'sqlserver-ex':
    case 'sqlserver-ee':
    case 'sqlserver-web':
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { MsSqlProvider } = require('./mssql-provider');
      return new MsSqlProvider(commonProps);
    case 'postgres':
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PostgresSqlProvider } = require('./postgres-provider');
      return new PostgresSqlProvider(commonProps);
    case 'mysql':
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { MySqlProvider } = require('./mysql-provider');
      return new MySqlProvider(commonProps);
    default:
      throw new Error('Cannot determine the provider to use. Please submit an Issue.');

  }
};

export const innerHandler = async ({ script, databaseName }: { script: string; databaseName: string }) => {

  const sm = new AWS.SecretsManager({ region: 'us-east-1' });
  const {
    SECRET_ARN: powerUserSecretArn,
  } = process.env;

  console.log('Getting secret...');
  const { SecretString: powerUserSecretString } = await sm.getSecretValue({ SecretId: powerUserSecretArn }).promise();

  if (!powerUserSecretString) {
    throw new Error('Could not determine the username and password. Make sure the provided Secret has a value and is an object with {username, password}');
  }
  const {
    username,
    password,
    host,
    port,
    engine,
  } = JSON.parse(powerUserSecretString);


  const provider = getProvider({
    host,
    port,
    engine,
    username,
    password,
    databaseName,
  });
  return provider.query(script);

};
/**
 * Handler for Custom Resources
 *
 * @param event
 * @param context
 */
export const handler = async (event: any, context: any) => {
  console.log('event: ', JSON.stringify(event, null, 2));
  try {
    if (event.RequestType === 'Delete') {
      await response.send(event, context, 'SUCCESS', null, event.PhysicalResourceId);
      return;
    }
    const {
      script,
      databaseName,
    } = event.ResourceProperties;
    const results = await innerHandler({ script, databaseName });
    await response.send(event, context, response.SUCCESS, null, null);
    return results;
  } catch (error) {
    // ... error checks
    console.log(error);
    await response.send(event, context, response.FAILED, { err: error });
  }
};

/**
 * Handler for direct execution
 *
 * @param event {script: string, databaseName: string}
 * @example {script: 'SELECT 1', databaseName: 'mydatabase'}
 */
export const adhocHandler = async (event: any) => {
  console.log('event:', JSON.stringify(event, null, 2));
  if (!event.script) {
    throw new Error('Please provide a script to run. e.g. `SELECT 1`');
  }
  if (!event.databaseName) {
    throw new Error('Please provide a databaseName. e.g. `mydatabase`');
  }
  const results: any = innerHandler(event);
  return results.rows;
};
