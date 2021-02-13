# API Reference

**Classes**

Name|Description
----|-----------
[DatabaseUser](#matthewbonig-rds-tools-databaseuser)|Create a user on a database.


**Structs**

Name|Description
----|-----------
[DatabaseUserProps](#matthewbonig-rds-tools-databaseuserprops)|*No description*



## class DatabaseUser  <a id="matthewbonig-rds-tools-databaseuser"></a>

Create a user on a database.

Can probably be merged with the DatabaseScript construct

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new DatabaseUser(scope: Construct, id: string, props: DatabaseUserProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[DatabaseUserProps](#matthewbonig-rds-tools-databaseuserprops)</code>)  *No description*
  * **databaseInstance** (<code>[DatabaseInstance](#aws-cdk-aws-rds-databaseinstance)</code>)  The database instance endpoint in RDS. 
  * **databases** (<code>Array<string></code>)  databases the user will have access. 
  * **username** (<code>string</code>)  The username to create. 
  * **masterSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  An optional Secret for accessing the database. __*Default*__: The root secret from the database instance
  * **secretNamePrefix** (<code>string</code>)  Secret is given name `${secretNamePrefix}${username}`. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**secret** | <code>[Secret](#aws-cdk-aws-secretsmanager-secret)</code> | <span></span>



## struct DatabaseUserProps  <a id="matthewbonig-rds-tools-databaseuserprops"></a>






Name | Type | Description 
-----|------|-------------
**databaseInstance** | <code>[DatabaseInstance](#aws-cdk-aws-rds-databaseinstance)</code> | The database instance endpoint in RDS.
**databases** | <code>Array<string></code> | databases the user will have access.
**username** | <code>string</code> | The username to create.
**masterSecret**? | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | An optional Secret for accessing the database.<br/>__*Default*__: The root secret from the database instance
**secretNamePrefix**? | <code>string</code> | Secret is given name `${secretNamePrefix}${username}`.<br/>__*Optional*__



