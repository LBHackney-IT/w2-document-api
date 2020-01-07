const SqlServerConnection = require('../../lib/SqlServerConnection');
jest.mock('mssql');
const sql = require('mssql');

describe('SqlServerConnection', function() {
  it('configures the connection pool and connects', async function() {
    const mockPool = {
      connect: jest.fn(),
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
    expect(mockPool.connect).toHaveBeenCalledTimes(1);
  });
});
