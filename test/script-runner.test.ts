import { getProvider } from '../src/handlers/index';
import { MsSqlProvider } from '../src/handlers/mssql-provider';
import { MySqlProvider } from '../src/handlers/mysql-provider';
import { PostgresSqlProvider } from '../src/handlers/postgres-provider';

// eslint-disable-next-line @typescript-eslint/no-require-imports
// const { innerHandler: handler } = require('../src/handlers/script-runner');


describe('handler', () => {
  process.env = {
    DATABASE_HOST: 'test-host',
    ENGINE: 'sqlserver-se',
  };

  /*
    it('smoke test', async () => {
      awsSdkPromiseResponse.mockClear();
      awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({
        SecretString: JSON.stringify({
          username: 'test-username',
          password: 'test-password',
          host: 'test-host',
          port: 1433,
          engine: 'sqlserver',
        }),
      }));

      await handler({
        ResourceProperties: { script: 'SELECT * FROM WHATEVER' },
        ResponseURL: 'https://localhost:3000',
      }, {
        logStreamName: 'test-logstream-name',
      });
    });
  */
});

describe('getProvider', () => {
  // @ts-ignore
  const testProvider = (engine) => getProvider({
    databaseName: 'some_app',
    host: 'somehost',
    password: 'somepassword',
    username: 'someusername',
    engine,
  });

  it('works for mysql', () => {
    expect(testProvider('mysql')).toBeInstanceOf(MySqlProvider);
  });

  it('works for postgres', () => {
    expect(testProvider('postgres')).toBeInstanceOf(PostgresSqlProvider);
  });

  it('works for sqlserver-se', () => {
    expect(testProvider('sqlserver-se')).toBeInstanceOf(MsSqlProvider);
  });

  it('works for sqlserver-ex', () => {
    expect(testProvider('sqlserver-ex')).toBeInstanceOf(MsSqlProvider);
  });

  it('works for sqlserver-ee', () => {
    expect(testProvider('sqlserver-ee')).toBeInstanceOf(MsSqlProvider);
  });

  it('works for sqlserver-web', () => {
    expect(testProvider('sqlserver-web')).toBeInstanceOf(MsSqlProvider);
  });
});