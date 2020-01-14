const SqlServerConnection = require('@lib/SqlServerConnection');
jest.mock('mssql');
const sql = require('mssql');

describe('SqlServerConnection', function() {
  it('configures the connection pool', async function() {
    const mockPool = {
      on: jest.fn()
    };
    sql.ConnectionPool = jest.fn(() => mockPool);

    new SqlServerConnection({
      dbUrl: 'mssql://user:pass@host/db'
    });

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
