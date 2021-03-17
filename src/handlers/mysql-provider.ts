import { IProvider } from './provider';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('promise-mysql');

export class MySqlProvider implements IProvider {
  private connection: any;
  private readonly connectionPromise: Promise<any>;
  constructor(props: { password: string; databaseName: string; port: string | undefined; host: string; username: string }) {
    this.connectionPromise = mysql.createConnection({
      host: props.host,
      user: props.username,
      port: props.port || 3306,
      password: props.password,
      database: props.databaseName || 'mysql',
    });
  }

  async query(script: string): Promise<any> {
    if (!this.connection) {
      console.log('Connecting...');
      this.connection = await this.connectionPromise;
    }
    console.log('Querying...');
    let results = await this.connection.query(script);
    console.log('Results: ', JSON.stringify(results, null, 2));
    return results;
  }
}