import { IProvider } from './provider';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('promise-mysql');

export class MySqlProvider implements IProvider {
  private connection: any;
  constructor(props: { password: string; databaseName: string; port: string | undefined; host: string; username: string }) {
    this.connection = mysql.createConnection({
      host: props.host,
      user: props.username,
      port: props.port || 3306,
      password: props.password,
      database: props.databaseName,
    });
  }

  query(script: string): Promise<any> {
    this.connection.connect();
    return this.connection.query(script);
  }
}