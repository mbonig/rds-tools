import { MsSqlProvider } from './mssql-provider';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AWS = require('aws-sdk');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const response = require('./cfn-response');

const sm = new AWS.SecretsManager();
const masterSecretArn = process.env.MASTER_SECRET_ARN;

export const handler = async (event: any, context: any) => {
  console.log('event: ', JSON.stringify(event, null, 2));

  if (event.RequestType === 'Delete') {
    // if the user is being deleted, we should do something..
    // TODO: do something if user is deleted?
    await response.send(event, context, 'SUCCESS', null, event.PhysicalResourceId);
    return;
  }

  try {
    const { databases, secretForUser } = event.ResourceProperties;

    const { SecretString: powerUserSecretString } = await sm.getSecretValue({ SecretId: masterSecretArn }).promise();
    const { host, username, password } = JSON.parse(powerUserSecretString);

    const { SecretString: userSecretString } = await sm.getSecretValue({ SecretId: secretForUser }).promise();
    const { username: usernameToCreate, password: passwordToUse } = JSON.parse(userSecretString);

    const mssqlProvider = new MsSqlProvider({ username, password, host });
    await mssqlProvider.createUser({ user: { username: usernameToCreate, password: passwordToUse }, databases });

    await response.send(event, context, response.SUCCESS, null, null);

  } catch (error) {
    // ... error checks
    console.log(error);
    await response.send(event, context, response.FAILED, { err: error });
  }
};


