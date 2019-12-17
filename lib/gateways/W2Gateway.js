const url = require('url');
const path = require('path');
const { fileType } = require('../Constants');
const { loadSQL } = require('../Utils');
const SqlServerConnection = require('../SqlServerConnection');

const { getDocumentMetadataSQL, getDocumentPagesSQL } = loadSQL(
  path.join(__dirname, '/../sql')
);

const dbUrl = url.parse(process.env.W2_DB_URL);
const [user, pass] = dbUrl.auth.split(':');
const dbConfig = {
  user: user,
  password: pass,
  server: dbUrl.host,
  database: dbUrl.path.replace('/', ''),
  requestTimeout: 60000
};
const db = new SqlServerConnection(dbConfig);

const W2Gateway = {
  getDocumentPages: async function(id) {
    return await db.request(getDocumentPagesSQL, [
      { id: 'id', type: 'Int', value: id }
    ]);
  },

  getDocumentMetadata: async function(id) {
    const results = await db.request(getDocumentMetadataSQL, [
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
