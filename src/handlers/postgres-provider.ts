import { IProvider } from './provider';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require('pg');

export class PostgresSqlProvider implements IProvider {
  private client: any;
  // @ts-ignore
  constructor(props: { password: string; databaseName?: string; port: string | undefined; host: string; username: string }) {
    this.client = new Client({
      user: props.username,
      host: props.host,
      database: props.databaseName || 'postgres',
      password: props.password,
      port: props.port || 5432,
    });
  }

  async query(script: string): Promise<any> {
    console.log('Connecting...');
    await this.client.connect();
    console.log('Querying....');
    const results = await this.client.query(script);
    this.client.end();
    console.log('Results:', JSON.stringify(results, null, 2));
    return results;
  }
}