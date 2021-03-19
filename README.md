# RDS Tools

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they
> become stable. We will only make breaking changes to address unforeseen API issues. Therefore,
> these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes
> will be announced in release notes. This means that while you may use them, you may need to
> update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This is a collection of CDK constructs you can use with RDS.

![Developer Preview](https://img.shields.io/badge/developer--preview-informational.svg?style=for-the-badge)

# DatabaseScript

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

# DatabaseUser

There was once a construct called DatabaseUser. However, it is better to use the standard code from the CDK directly:

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

