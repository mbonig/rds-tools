# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### DatabaseScript <a name="DatabaseScript" id="@matthewbonig/rds-tools.DatabaseScript"></a>

- *Implements:* aws-cdk-lib.aws_ec2.IConnectable

#### Initializers <a name="Initializers" id="@matthewbonig/rds-tools.DatabaseScript.Initializer"></a>

```typescript
import { DatabaseScript } from '@matthewbonig/rds-tools'

new DatabaseScript(scope: Construct, id: string, props: DatabaseScriptProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.Initializer.parameter.props">props</a></code> | <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps">DatabaseScriptProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@matthewbonig/rds-tools.DatabaseScript.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@matthewbonig/rds-tools.DatabaseScript.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@matthewbonig/rds-tools.DatabaseScript.Initializer.parameter.props"></a>

- *Type:* <a href="#@matthewbonig/rds-tools.DatabaseScriptProps">DatabaseScriptProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.bind">bind</a></code> | Grants access to the Lambda Function to the given SecurityGroup. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.slugify">slugify</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@matthewbonig/rds-tools.DatabaseScript.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### ~~`bind`~~ <a name="bind" id="@matthewbonig/rds-tools.DatabaseScript.bind"></a>

```typescript
public bind(securityGroup: SecurityGroup, port: Port): DatabaseScript
```

Grants access to the Lambda Function to the given SecurityGroup.

Adds an ingress rule to the given security group and for the given port.

###### `securityGroup`<sup>Required</sup> <a name="securityGroup" id="@matthewbonig/rds-tools.DatabaseScript.bind.parameter.securityGroup"></a>

- *Type:* aws-cdk-lib.aws_ec2.SecurityGroup

---

###### `port`<sup>Required</sup> <a name="port" id="@matthewbonig/rds-tools.DatabaseScript.bind.parameter.port"></a>

- *Type:* aws-cdk-lib.aws_ec2.Port

---

##### `slugify` <a name="slugify" id="@matthewbonig/rds-tools.DatabaseScript.slugify"></a>

```typescript
public slugify(x: string): string
```

###### `x`<sup>Required</sup> <a name="x" id="@matthewbonig/rds-tools.DatabaseScript.slugify.parameter.x"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@matthewbonig/rds-tools.DatabaseScript.isConstruct"></a>

```typescript
import { DatabaseScript } from '@matthewbonig/rds-tools'

DatabaseScript.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@matthewbonig/rds-tools.DatabaseScript.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.property.adhocConnections">adhocConnections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | *No description.* |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | The network connections associated with this resource. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.property.handler">handler</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScript.property.adhocHandler">adhocHandler</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The underlying Lambda handler function for making adhoc commands against the database. |

---

##### `node`<sup>Required</sup> <a name="node" id="@matthewbonig/rds-tools.DatabaseScript.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `adhocConnections`<sup>Required</sup> <a name="adhocConnections" id="@matthewbonig/rds-tools.DatabaseScript.property.adhocConnections"></a>

```typescript
public readonly adhocConnections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

---

##### `connections`<sup>Required</sup> <a name="connections" id="@matthewbonig/rds-tools.DatabaseScript.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

The network connections associated with this resource.

---

##### `handler`<sup>Required</sup> <a name="handler" id="@matthewbonig/rds-tools.DatabaseScript.property.handler"></a>

```typescript
public readonly handler: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `adhocHandler`<sup>Optional</sup> <a name="adhocHandler" id="@matthewbonig/rds-tools.DatabaseScript.property.adhocHandler"></a>

```typescript
public readonly adhocHandler: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The underlying Lambda handler function for making adhoc commands against the database.

Undefined unless 'enableAdhoc' is true

---


## Structs <a name="Structs" id="Structs"></a>

### DatabaseScriptProps <a name="DatabaseScriptProps" id="@matthewbonig/rds-tools.DatabaseScriptProps"></a>

#### Initializer <a name="Initializer" id="@matthewbonig/rds-tools.DatabaseScriptProps.Initializer"></a>

```typescript
import { DatabaseScriptProps } from '@matthewbonig/rds-tools'

const databaseScriptProps: DatabaseScriptProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps.property.script">script</a></code> | <code>string</code> | The script to execute. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps.property.databaseInstance">databaseInstance</a></code> | <code>aws-cdk-lib.aws_rds.DatabaseInstance</code> | The database instance to run the script against. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps.property.databaseName">databaseName</a></code> | <code>string</code> | An optional databaseName. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps.property.enableAdhoc">enableAdhoc</a></code> | <code>boolean</code> | Deploy a second Lambda function that allows for adhoc sql against the database? |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | An optional secret that provides credentials for the database. |
| <code><a href="#@matthewbonig/rds-tools.DatabaseScriptProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | The VPC for the Lambda Function to attach to. |

---

##### `script`<sup>Required</sup> <a name="script" id="@matthewbonig/rds-tools.DatabaseScriptProps.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

The script to execute.

---

##### `databaseInstance`<sup>Optional</sup> <a name="databaseInstance" id="@matthewbonig/rds-tools.DatabaseScriptProps.property.databaseInstance"></a>

```typescript
public readonly databaseInstance: DatabaseInstance;
```

- *Type:* aws-cdk-lib.aws_rds.DatabaseInstance

The database instance to run the script against.

---

##### `databaseName`<sup>Optional</sup> <a name="databaseName" id="@matthewbonig/rds-tools.DatabaseScriptProps.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

An optional databaseName.

If none is provided then it will be the default for the rds instance, as defined by the AWS docs.

mysql - mysql
mssql - master
postgres - postgres

---

##### `enableAdhoc`<sup>Optional</sup> <a name="enableAdhoc" id="@matthewbonig/rds-tools.DatabaseScriptProps.property.enableAdhoc"></a>

```typescript
public readonly enableAdhoc: boolean;
```

- *Type:* boolean
- *Default:* false

Deploy a second Lambda function that allows for adhoc sql against the database?

---

##### `secret`<sup>Optional</sup> <a name="secret" id="@matthewbonig/rds-tools.DatabaseScriptProps.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret
- *Default:* the root secret from the database instance

An optional secret that provides credentials for the database.

Must have fields 'username' and 'password'

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@matthewbonig/rds-tools.DatabaseScriptProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

The VPC for the Lambda Function to attach to.

If one is not provide, it's assumed from the database instance.

---



