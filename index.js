require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const gateways = {
  dbGateway: require('./lib/gateways/W2Gateway'),
  imageServerGateway: require('./lib/gateways/ImageServerGateway')
};
const {
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument
} = require('./lib/use-cases')(gateways);

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
    const { mimeType, doc } = await getConvertedDocument(metadata);
    res.set('Content-Type', mimeType);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
