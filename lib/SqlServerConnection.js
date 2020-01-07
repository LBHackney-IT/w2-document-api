const sql = require('mssql');
const url = require('url');

class SqlServerConnection {
  constructor(config) {
    const dbUrl = url.parse(config.dbUrl);
    const [user, pass] = dbUrl.auth.split(':');

    this.pool = new sql.ConnectionPool({
      user: user,
      password: pass,
      server: dbUrl.host,
      database: dbUrl.path.replace('/', ''),
      requestTimeout: 60000
    });

    this.pool.on('error', err => {
      console.log(err);
    });

    this.pool.connect();
  }

  async request(query, params) {
    await this.pool;
    const request = this.pool.request();
    params.forEach(param => {
      request.input(param.id, sql[param.type], param.value);
    });
    try {
      const result = await request.query(query);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = SqlServerConnection;
