const url = require('url');
const mssql = require('mssql');
const dbUrl = url.parse(process.env.W2_DB_URL);
const [user, pass] = dbUrl.auth.split(':');

const dbConfig = {
  user: user,
  password: pass,
  server: dbUrl.host,
  database: dbUrl.path.replace('/', ''),
  requestTimeout: 60000
};

const SqlServerConnection = require('../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);

const W2Gateway = {
  getDocumentMetadata: async function(id) {
    const sql = `SELECT
    DocNo AS id,
    ContactNo AS contactId,
    UserID AS userId,
    DocDesc AS description,
    DocCategory AS category,
    DocDate AS date,
    DirectionFg AS direction,
    DocSource AS type,
    FileHandle AS imageId,
    ReceivedDate AS receivedDate,
    FileExtension AS extension,
    Title AS title,
    FileName AS name
  FROM
    CCDocument
  WHERE
    DocNo = @id`;

    const results = await db.request(sql, [
      { id: 'id', type: 'Int', value: id }
    ]);

    if (results.length > 0) {
      return results[0];
    }
  }
};

module.exports = W2Gateway;
