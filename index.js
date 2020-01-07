require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const SqlServerConnection = require('./lib/SqlServerConnection');

const { loadTemplates } = require('./lib/Utils');
const { downloadTemplate, emailTemplate } = loadTemplates(
  path.join(__dirname, './lib/templates')
);

const useCaseOptions = {
  dbGateway: require('./lib/gateways/W2Gateway')({
    dbConnection: new SqlServerConnection({
      dbUrl: process.env.W2_DB_URL
    })
  }),
  downloadTemplate,
  emailTemplate,
  imageServerGateway: require('./lib/gateways/ImageServerGateway')({
    imageServerUrl: process.env.W2_IMAGE_SERVER_URL
  }),
  tempPath: '/tmp'
};
const {
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument
} = require('./lib/use-cases')(useCaseOptions);

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

app.listen(port, () => console.log(`App listening on port ${port}!`));
