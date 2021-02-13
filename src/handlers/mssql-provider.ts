// eslint-disable-next-line @typescript-eslint/no-require-imports
const sql = require('mssql');

interface User {
  password: string;
  username: string;
}

export class MsSqlProvider {
  private readonly username: string;
  private readonly password: string;
  private readonly host: string;

  constructor(props: {
    host: string;
    password: string;
    username: string;
  }) {
    this.username = props.username;
    this.password = props.password;
    this.host = props.host;
  }

  async createUser(props: {
    user: User;
    databases: string[];
  }) {

    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(`mssql://${this.username}:${this.password}@${this.host}/master`);

    console.log(`Creating user ${props.user.username}`);

    await sql.query(`IF NOT EXISTS(SELECT principal_id FROM sys.server_principals WHERE name = '${props.user.username}') BEGIN
/* Syntax for SQL server login.  See BOL for domain logins, etc. */
    CREATE LOGIN [${props.user.username}] WITH PASSWORD = '${props.user.password}';
END
`);

    for (const database of props.databases) {
      await sql.query(`USE ${database}`);
      await sql.query(`/* Create the user for the specified login. */
IF NOT EXISTS(SELECT principal_id FROM sys.database_principals WHERE name = '${props.user.username}') BEGIN
    CREATE USER [${props.user.username}] FOR LOGIN [${props.user.username}];
    ALTER ROLE [db_appexecute] ADD MEMBER [${props.user.username}];
END`);
    }
  }

  async updateUser(user: User) {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(`mssql://${this.username}:${this.password}@${this.host}/master`);

    console.log(`Updating user ${user.username}`);
    await sql.query(`ALTER LOGIN [${user.username}] WITH PASSWORD = '${user.password}';`);
    console.log('Login updated.');
  }
}