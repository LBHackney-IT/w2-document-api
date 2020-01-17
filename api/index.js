require('module-alias/register');
require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const app = express();

const SqlServerConnection = require('@lib/SqlServerConnection');

const { loadTemplates } = require('@lib/Utils');

const { downloadTemplate, emailTemplate } = loadTemplates(
  path.join(__dirname, 'lib/templates')
);

const imageServerGateway = require('@lib/gateways/ImageServerGateway')({
  imageServerUrl: process.env.W2_IMAGE_SERVER_URL
});

const documentHandlers = require('@lib/documentHandlers')({
  emailTemplate,
  imageServerGateway
});

let cacheGatewayOptions = {
  s3: new AWS.S3()
};

if (process.env.NODE_ENV === 'development') {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE_NAME
  });
  cacheGatewayOptions.s3 = new AWS.S3({ credentials });
}

const useCaseOptions = {
  cacheGateway: require('@lib/gateways/S3Gateway')(cacheGatewayOptions),
  dbGateway: require('@lib/gateways/W2Gateway')({
    dbConnection: new SqlServerConnection({
      dbUrl: process.env.W2_DB_URL
    })
  }),
  documentHandlers,
  imageServerGateway: require('@lib/gateways/ImageServerGateway')({
    imageServerUrl: process.env.W2_IMAGE_SERVER_URL
  })
};

const {
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument
} = require('@lib/use-cases')(useCaseOptions);

app.get('/attachments/:id/download', async (req, res) => {
  res.sendStatus(200);
});

app.get('/attachments/:id/view', async (req, res) => {
  res.sendStatus(200);
});

app.get('/documents/:id', async (req, res) => {
  try {
    const metadata = await getDocumentMetadata(req.params.id);
    res.send(metadata);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/documents/:id/download', async (req, res) => {
  try {
    const metadata = await getDocumentMetadata(req.params.id);
    const { mimeType, doc, filename } = await getOriginalDocument(metadata);
    res.set('Content-Type', mimeType);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/documents/:id/view', async (req, res) => {
  try {
    const metadata = await getDocumentMetadata(req.params.id);
    const converted = await getConvertedDocument(metadata);
    if (converted) {
      res.set('Content-Type', converted.mimeType);
      res.send(converted.doc);
    } else {
      res.send(downloadTemplate({ id: req.params.id }));
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports.handler = serverless(app, {
  binary: ['*/*']
});
