const url = require('url');
const path = require('path');
const { W2DocType } = require('../Constants');
const { loadSQL } = require('../Utils');
const SqlServerConnection = require('../SqlServerConnection');

const {
  getDocumentMetadataSQL,
  getDocumentPagesSQL,
  getEmailAttachmentsSQL,
  getEmailMetadataSQL
} = loadSQL(path.join(__dirname, '/../sql'));

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
  getEmailMetadata: async function(id) {
    return (
      await db.request(getEmailMetadataSQL, [
        { id: 'id', type: 'Int', value: id }
      ])
    )[0];
  },

  getEmailAttachments: async function(id) {
    return await db.request(getEmailAttachmentsSQL, [
      { id: 'id', type: 'Int', value: id }
    ]);
  },

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

      file.type = W2DocType[file.type];

      if (file.type === 'Scanned') {
        file.pages = await W2Gateway.getDocumentPages(file.id);
      }
      if (file.type === 'Email') {
        file.emailMetadata = await W2Gateway.getEmailMetadata(file.imageId);
        file.attachments = await W2Gateway.getEmailAttachments(file.imageId);
        file.imageId = null;
      }
      return file;
    }
  }
};

module.exports = W2Gateway;
