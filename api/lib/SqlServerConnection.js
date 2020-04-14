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

    this.poolConnect = this.pool.connect();

    this.pool.on('error', err => {
      console.log(err);
    });
  }

  async request(query, params) {
    try {
      await this.poolConnect;

      const request = this.pool.request();

      params.forEach(param => {
        request.input(param.id, sql[param.type], param.value);
      });

      const result = await request.query(query);

      // trim whitespace from varchar column values
      result.recordset.forEach(record => {
        Object.keys(record).forEach(key => {
          if (typeof record[key] === 'string') {
            record[key] = record[key].trim();
          }
        });
      });

      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = SqlServerConnection;
