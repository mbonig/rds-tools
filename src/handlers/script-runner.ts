
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { IProvider } from './provider';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AWS = require('aws-sdk');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const response = require('./cfn-response');


export function getProvider(props: {
  username: string;
  password: string;
  host: string;
  databaseName?: string;
  engine: string;
  port?: string;
}): IProvider {
  const commonProps = {
    host: props.host,
    port: props.port,
    username: props.username,
    password: props.password,
    databaseName: props.databaseName,
  };

  switch (props.engine) {
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
}

export const innerHandler = async (event: any, context: any) => {
  console.log('event: ', JSON.stringify(event, null, 2));

  if (event.RequestType === 'Delete') {
    await response.send(event, context, 'SUCCESS', null, event.PhysicalResourceId);
    return;
  }

  const sm = new AWS.SecretsManager({ region: 'us-east-1' });
  const {
    SECRET_ARN: powerUserSecretArn,
    DATABASE_HOST: databaseHost,
    DATABASE_PORT: databasePort,
    ENGINE: engine,
  } = process.env;

  if (!databaseHost) {
    throw new Error('Please provide a \'DATABASE_HOST\' environment variable.');
  }
  if (!engine) {
    throw new Error('Could not determine an engine type. Please open an Issue.');
  }

  const { script, databaseName } = event.ResourceProperties;

  console.log('Getting secret...');
  const { SecretString: powerUserSecretString } = await sm.getSecretValue({ SecretId: powerUserSecretArn }).promise();

  if (!powerUserSecretString) {
    throw new Error('Could not determine the username and password. Make sure the provided Secret has a value and is an object with {username, password}');
  }
  const {
    username,
    password,
  } = JSON.parse(powerUserSecretString);

  const provider = getProvider({
    host: databaseHost,
    port: databasePort,
    engine,
    username,
    password,
    databaseName,
  });
  return provider.query(script);

};
export const handler = async (event: any, context: any) => {
  try {
    const results = await innerHandler(event, context);
    await response.send(event, context, response.SUCCESS, null, null);
    return results;
  } catch (error) {
    // ... error checks
    console.log(error);
    await response.send(event, context, response.FAILED, { err: error });
  }
};
