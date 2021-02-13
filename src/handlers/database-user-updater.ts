import { MsSqlProvider } from './mssql-provider';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AWS = require('aws-sdk');
const sm = new AWS.SecretsManager();

const sourceSecretName = process.env.SOURCE_SECRET_NAME!;
const masterSecretArn = process.env.MASTER_SECRET_ARN!;

export const handler = async (event: any) => {
  console.log('event: ', JSON.stringify(event, null, 2));

  if (!(event.source === 'aws.secretsmanager' && event.detail.eventName === 'PutSecretValue' && sourceSecretName.startsWith(event.detail.requestParameters.secretId))) {
    console.info('Wasn\'t the secret we\'re looking for...');
    return;
  }

  const { SecretString: masterSecret } = await sm.getSecretValue({ SecretId: masterSecretArn }).promise();
  const { password: masterPassword, username: masterUsername, host } = JSON.parse(masterSecret);

  const { SecretString: secret } = await sm.getSecretValue({ SecretId: event.detail.requestParameters.secretId }).promise();
  const { password, username } = JSON.parse(secret);

  const msSqlProvider = new MsSqlProvider({ username: masterUsername, password: masterPassword, host });

  await msSqlProvider.updateUser({ username, password });

};