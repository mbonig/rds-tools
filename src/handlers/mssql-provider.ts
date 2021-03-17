import { IProvider } from './provider';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sql = require('mssql');

export class MsSqlProvider implements IProvider {
  private readonly username: string;
  private readonly password: string;
  private readonly host: string;
  private readonly databaseName: string;
  private readonly port: string;

  constructor(props: {
    databaseName?: string;
    host: string;
    password: string;
    username: string;
    port?: string;
  }) {
    this.username = props.username;
    this.password = props.password;
    this.host = props.host;
    this.databaseName = props.databaseName || 'master';
    this.port = props.port || '3306';
  }

  async query(script: string): Promise<any> {
    console.log('Connecting to database...');
    await sql.connect(`mssql://${this.username}:${this.password}@${this.host}:${this.port}/${this.databaseName}`);
    console.log('Connected. Running query...');
    const results = await sql.query(script);
    console.log('Query run: ', JSON.stringify(results, null, 2));
    return results;
  }
}