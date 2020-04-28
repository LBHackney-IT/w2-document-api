const path = require('path');
const AWS = require('aws-sdk');
const SqlServerConnection = require('@lib/SqlServerConnection');

const { loadTemplates } = require('@lib/Utils');
const templates = loadTemplates(path.join(__dirname, 'templates'));

const imageServerGateway = require('@lib/gateways/ImageServerGateway')({
  imageServerUrl: process.env.W2_IMAGE_SERVER_URL
});

const useCaseOptions = {
  cacheGateway: require('@lib/gateways/S3Gateway')({
    s3: new AWS.S3()
  }),
  dbGateway: require('@lib/gateways/W2Gateway')({
    dbConnection: new SqlServerConnection({
      dbUrl: process.env.W2_DB_URL
    })
  }),
  documentHandlers: require('@lib/documentHandlers')({
    emailTemplate: templates.emailTemplate,
    imageServerGateway
  }),
  imageServerGateway
};

const {
  getCustomerDocuments,
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument,
  getAttachment
} = require('@lib/use-cases')(useCaseOptions);

module.exports = {
  getCustomerDocuments,
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument,
  getAttachment,
  templates
};
