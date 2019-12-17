const url = require('url');
const fileType = require('../constants/FileType');
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
  getDocumentPages: async function(id) {
    const sql = `SELECT
    W2Page.PAGE_NO AS page,
    W2Image.IS_HDL AS imageId
  FROM
    W2Page
    JOIN W2Image ON W2Page.IMAGE_HDL = W2Image.HDL
  WHERE
    W2Page.HDL = @id
  ORDER BY
    W2Page.PAGE_NO;`;

    return await db.request(sql, [{ id: 'id', type: 'Int', value: id }]);
  },

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
      let file = results[0];
      if (file.type === fileType.ScannedDocument) {
        file.pages = await W2Gateway.getDocumentPages(file.id);
      }
      return file;
    }
  }
};

module.exports = W2Gateway;
