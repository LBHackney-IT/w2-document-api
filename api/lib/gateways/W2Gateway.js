const path = require('path');
const { DocSystems } = require('@lib/Constants');
const { loadSQL } = require('@lib/Utils');

const {
  getCustomerAcademyDocumentsSQL,
  getCustomerDocumentsSQL,
  getDocumentMetadataSQL,
  getDocumentPagesSQL,
  getEmailAttachmentsSQL,
  getEmailAttachmentMetadataSQL,
  getEmailMetadataSQL
} = loadSQL(path.join(__dirname, '../sql'));

const buildDocuments = (documents, system) =>
  documents.map(doc => ({
    date: doc.DocDate,
    format: null,
    id: doc.DocNo,
    system: DocSystems[system],
    text: `${doc.DocDesc}${doc.title ? ' - ' + doc.title : ''}`,
    title: 'Document',
    user: doc.UserID
  }));

const documentsSql = system => {
  if (system === 'hncomino') {
    return getCustomerAcademyDocumentsSQL;
  }

  if (system === 'uhw') {
    return getCustomerDocumentsSQL;
  }
};

const documentsQueryParams = (system, id) => {
  if (system === 'hncomino') {
    return [
      { id: 'account_ref', type: 'NVarChar', value: id },
      { id: 'claim_id', type: 'NVarChar', value: id }
    ];
  }

  if (system === 'uhw') {
    return [{ id: 'id', type: 'Int', value: id }];
  }
};

module.exports = function({ dbConnection }) {
  return {
    getCustomerDocuments: async function(id, system) {
      const documents = await dbConnection.request(
        documentsSql(system),
        documentsQueryParams(system, id)
      );

      return buildDocuments(documents, system);
    },

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

    getEmailAttachmentMetadata: async function(id) {
      return await dbConnection.request(getEmailAttachmentMetadataSQL, [
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
