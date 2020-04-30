const sql = require('mssql');
const url = require('url');

module.exports = options => {
  const dbUrl = url.parse(options.dbUrl);
  const [user, pass] = dbUrl.auth.split(':');
  const config = {
    user: user,
    password: pass,
    server: dbUrl.host,
    database: dbUrl.path.replace('/', ''),
    requestTimeout: 60000
  };

  return {
    request: async (query, params) => {
      const pool = await new sql.ConnectionPool(config).connect();
      const request = new sql.Request(pool);
      if (params) {
        params.forEach(param => {
          request.input(param.id, sql[param.type], param.value);
        });
      }
      const result = await request.query(query);
      await sql.close();

      // trim whitespace from varchar column values
      result.recordset.forEach(record => {
        Object.keys(record).forEach(key => {
          if (typeof record[key] === 'string') {
            record[key] = record[key].trim();
          }
        });
      });

      return result.recordset;
    }
  };
};
