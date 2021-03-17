# RDS Tools

This is a collection of CDK constructs you can use with RDS.

***This is an experiment in code. Do not use in production.***

If you want the DatabaseUser, just use what is already available in the CDK:

```typescript
const myUserSecret = new rds.DatabaseSecret(this, 'MyUserSecret', {
  username: 'myuser',
  masterSecret: instance.secret,
  excludeCharacters: '{}[]()\'"/\\', // defaults to the set " %+~`#$&*()|[]{}:;<>?!'/@\"\\"
});
const myUserSecretAttached = myUserSecret.attach(instance); // Adds DB connections information in the secret
instance.addRotationMultiUser('MyUser', { // Add rotation using the multi user scheme
  secret: myUserSecretAttached,
});
```

# Database Script

Provides a Custom Resource and Lambda Function that will run in given script against a given database.

```typescript
const databaseInstance = new DatabaseInstance(stack, 'test-database', {
  engine: DatabaseInstanceEngine.sqlServerWeb({ version: SqlServerEngineVersion.VER_15_00_4043_16_V1 }),
  vpc: vpc,
});


// ...


new DatabaseScript(stack2, 'test', {
  databaseInstance,
  script: 'SELECT 1',
});
```

