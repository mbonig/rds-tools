import { IProvider } from './provider';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require('pg');

export class PostgresSqlProvider implements IProvider {
  private client: any;
  // @ts-ignore
  constructor(props: { password: string; databaseName: string; port: string | undefined; host: string; username: string }) {
    this.client = new Client({
      user: props.username,
      host: props.host,
      database: props.databaseName,
      password: props.password,
      port: props.port || 5432,
    });
  }

  async query(script: string): Promise<any> {
    await this.client.connect();
    const results = await this.client.query(script);
    this.client.end();
    return results;
  }
}