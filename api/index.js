require('module-alias/register');
require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const app = express();

if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
  const Sentry = require('@sentry/node');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV
  });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
}

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

const useCaseOptions = {
  cacheGateway: require('@lib/gateways/S3Gateway')({
    s3: new AWS.S3()
  }),
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
  getCustomerDocuments,
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument,
  getAttachment
} = require('@lib/use-cases')(useCaseOptions);

// DO I NEED CORS?
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(function(req, res, next) {
  // had to rewrite the path to get it playing nice with a not-root resource in api gateway
  req.url = req.url.replace(`/${process.env.URL_PREFIX}`, '');
  next();
});

app.get('/attachments/:imageId/download', async (req, res) => {
  const converted = await getAttachment(req.params.imageId);
  res.send(converted.doc);
});

app.get('/attachments/:imageId/view', async (req, res) => {
  try {
    const attachment = await getAttachment(req.params.imageId);
    if (attachment) {
      res.type(attachment.mimeType);
      res.end(attachment.doc, 'binary');
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/customers/:id/documents', async (req, res) => {
  try {
    const system = process.env.URL_PREFIX;
    const documents = await getCustomerDocuments(req.params.id, system);
    res.send(documents);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
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
      if (converted.url)
        return res.send(downloadTemplate({ url: converted.url }));
      res.set('Content-Type', converted.mimeType);
      res.send(converted.doc);
    } else {
      res.send(
        downloadTemplate({
          id: req.params.id,
          system: process.env.URL_PREFIX
        })
      );
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = {
  handler: serverless(app, {
    binary: ['*/*']
  }),
  app
};
