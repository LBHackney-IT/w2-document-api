const SqlServerConnection = require('@lib/SqlServerConnection');
jest.mock('mssql');
const sql = require('mssql');

describe('SqlServerConnection', function() {
  it('configures the connection pool', async function() {
    const mockPool = {
      on: jest.fn(),
      connect: jest.fn()
    };
    sql.ConnectionPool = jest.fn(() => mockPool);

    const db = SqlServerConnection({
      dbUrl: 'mssql://user:pass@host/db'
    });

    db.request('hello', {});

    expect(sql.ConnectionPool).toHaveBeenCalledTimes(1);
    expect(sql.ConnectionPool).toHaveBeenCalledWith({
      user: 'user',
      password: 'pass',
      server: 'host',
      database: 'db',
      requestTimeout: 60000
    });
  });
});
