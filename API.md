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



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new DatabaseScript(scope: Construct, id: string, props: DatabaseScriptProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[DatabaseScriptProps](#matthewbonig-rds-tools-databasescriptprops)</code>)  *No description*
  * **databaseInstance** (<code>[DatabaseInstance](#aws-cdk-aws-rds-databaseinstance)</code>)  The database instance to run the script against. 
  * **script** (<code>string</code>)  The script to execute. 
  * **secret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  An optional secret that provides credentials for the database. __*Default*__: the root secret from the database instance




## struct DatabaseScriptProps  <a id="matthewbonig-rds-tools-databasescriptprops"></a>






Name | Type | Description 
-----|------|-------------
**databaseInstance** | <code>[DatabaseInstance](#aws-cdk-aws-rds-databaseinstance)</code> | The database instance to run the script against.
**script** | <code>string</code> | The script to execute.
**secret**? | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | An optional secret that provides credentials for the database.<br/>__*Default*__: the root secret from the database instance



