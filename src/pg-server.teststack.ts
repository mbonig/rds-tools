import { App, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { DatabaseScript } from '.';

const app = new App();
let baseId = 'pg-server-test-stack';
const stack = new Stack(app, baseId + '-database', {
  env: {
    region: 'us-east-1',
    account: '581514672367',
  },
});
const vpc = new Vpc(stack, 'test-vpc', {
  maxAzs: 2,
});

const databaseInstance = new DatabaseInstance(stack, 'test-database', {
  engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_12_4 }),
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