const path = require('path');
const { W2DocType } = require('../Constants');
const { loadSQL } = require('../Utils');

const {
  getDocumentMetadataSQL,
  getDocumentPagesSQL,
  getEmailAttachmentsSQL,
  getEmailMetadataSQL
} = loadSQL(path.join(__dirname, '/../sql'));

module.exports = function({ dbConnection }) {
  return {
    getDocumentPages: async function(id) {
      return await dbConnection.request(getDocumentPagesSQL, [
        { id: 'id', type: 'Int', value: id }
      ]);
    },

    getDocumentMetadata: async function(id) {
      const results = await dbConnection.request(getDocumentMetadataSQL, [
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
    },

    getEmailAttachments: async function(id) {
      return await dbConnection.request(getEmailAttachmentsSQL, [
        { id: 'id', type: 'Int', value: id }
      ]);
    },

    getEmailMetadata: async function(id) {
      return (
        await dbConnection.request(getEmailMetadataSQL, [
          { id: 'id', type: 'Int', value: id }
        ])
      )[0];
    }
  };
};
