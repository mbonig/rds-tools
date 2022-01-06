# API Reference

**Classes**

Name|Description
----|-----------
[DatabaseScript](#matthewbonig-rds-tools-databasescript)|*No description*


**Structs**

Name|Description
----|-----------
[DatabaseScriptProps](#matthewbonig-rds-tools-databasescriptprops)|*No description*



## class DatabaseScript  <a id="matthewbonig-rds-tools-databasescript"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new DatabaseScript(scope: Construct, id: string, props: DatabaseScriptProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[DatabaseScriptProps](#matthewbonig-rds-tools-databasescriptprops)</code>)  *No description*
  * **script** (<code>string</code>)  The script to execute. 
  * **databaseInstance** (<code>[aws_rds.DatabaseInstance](#aws-cdk-lib-aws-rds-databaseinstance)</code>)  The database instance to run the script against. __*Optional*__
  * **databaseName** (<code>string</code>)  An optional databaseName. __*Optional*__
  * **secret** (<code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code>)  An optional secret that provides credentials for the database. __*Default*__: the root secret from the database instance
  * **vpc** (<code>[aws_ec2.IVpc](#aws-cdk-lib-aws-ec2-ivpc)</code>)  The VPC for the Lambda Function to attach to. __*Optional*__


### Methods


#### bind(securityGroup, port) <a id="matthewbonig-rds-tools-databasescript-bind"></a>

Grants access to the Lambda Function to the given SecurityGroup.

Adds an ingress rule to the given security group and for the given port.

```ts
bind(securityGroup: SecurityGroup, port: Port): DatabaseScript
```

* **securityGroup** (<code>[aws_ec2.SecurityGroup](#aws-cdk-lib-aws-ec2-securitygroup)</code>)  *No description*
* **port** (<code>[aws_ec2.Port](#aws-cdk-lib-aws-ec2-port)</code>)  *No description*

__Returns__:
* <code>[DatabaseScript](#matthewbonig-rds-tools-databasescript)</code>

#### slugify(x) <a id="matthewbonig-rds-tools-databasescript-slugify"></a>



```ts
slugify(x: string): string
```

* **x** (<code>string</code>)  *No description*

__Returns__:
* <code>string</code>



## struct DatabaseScriptProps  <a id="matthewbonig-rds-tools-databasescriptprops"></a>






Name | Type | Description 
-----|------|-------------
**script** | <code>string</code> | The script to execute.
**databaseInstance**? | <code>[aws_rds.DatabaseInstance](#aws-cdk-lib-aws-rds-databaseinstance)</code> | The database instance to run the script against.<br/>__*Optional*__
**databaseName**? | <code>string</code> | An optional databaseName.<br/>__*Optional*__
**secret**? | <code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code> | An optional secret that provides credentials for the database.<br/>__*Default*__: the root secret from the database instance
**vpc**? | <code>[aws_ec2.IVpc](#aws-cdk-lib-aws-ec2-ivpc)</code> | The VPC for the Lambda Function to attach to.<br/>__*Optional*__



