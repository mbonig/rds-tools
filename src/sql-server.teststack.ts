import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, SqlServerEngineVersion } from 'aws-cdk-lib/aws-rds';
import { App, Stack } from 'aws-cdk-lib/core';
// @ts-ignore
import { DatabaseScript } from '.';

const app = new App();
let baseId = 'sql-server-test-stack';
const stack = new Stack(app, baseId +'-database', {
  env: {
    region: 'us-east-1',
    account: '581514672367',
  },
});
const vpc = new Vpc(stack, 'test-vpc', {
  maxAzs: 2,
});
// @ts-ignore
const databaseInstance = new DatabaseInstance(stack, 'test-database', {
  engine: DatabaseInstanceEngine.sqlServerWeb({ version: SqlServerEngineVersion.VER_15_00_4043_16_V1 }),
  vpc: vpc,
});

const stack2 = new Stack(app, baseId + '-script', {
  env: {
    region: 'us-east-1',
    account: '581514672367',
  },
});
new DatabaseScript(stack2, 'test', {
  databaseInstance,
  script: 'SELECT 1',
});


app.synth();