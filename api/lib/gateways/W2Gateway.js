const path = require('path');
const { loadSQL } = require('@lib/Utils');

const {
  getDocumentMetadataSQL,
  getDocumentPagesSQL,
  getEmailAttachmentsSQL,
  getEmailMetadataSQL
} = loadSQL(path.join(__dirname, '../sql'));

module.exports = function({ dbConnection }) {
  return {
    getDocumentPages: async function(id) {
      return await dbConnection.request(getDocumentPagesSQL, [
        { id: 'id', type: 'Int', value: id }
      ]);
    },

    getDocumentMetadata: async function(id) {
      return (
        await dbConnection.request(getDocumentMetadataSQL, [
          { id: 'id', type: 'Int', value: id }
        ])
      )[0];
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
