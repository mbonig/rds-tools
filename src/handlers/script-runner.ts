export const handler = async (event: any, context: any) => {
  console.log('event: ', JSON.stringify(event, null, 2));
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const response = require('./cfn-response');

  if (event.RequestType === 'Delete') {
    await response.send(event, context, 'SUCCESS', null, event.PhysicalResourceId);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sql = require('mssql');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AWS = require('aws-sdk');

  const sm = new AWS.SecretsManager({ region: 'us-east-1' });
  const {
    SECRET_ARN: powerUserSecretArn,
    DATABASE_HOST: databaseHost,
    DATABASE_PORT: databasePort,
  } = process.env;
  try {
    const { script } = event.ResourceProperties;

    const { SecretString: powerUserSecretString } = await sm.getSecretValue({ SecretId: powerUserSecretArn }).promise();
    const { username, password } = JSON.parse(powerUserSecretString);

    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(`mssql://${username}:${password}@${databaseHost}:${databasePort}/master`);
    await sql.query(script);
    await response.send(event, context, response.SUCCESS, null, null);

  } catch (error) {
    // ... error checks
    console.log(error);
    await response.send(event, context, response.FAILED, { err: error });
  }
};
