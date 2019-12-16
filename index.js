require('dotenv').config();
const express = require('express');
const app = express();
const mimeTypes = require('mime-types');
const port = process.env.PORT || 3000;

const gateways = {
  dbGateway: require('./lib/gateways/W2Gateway'),
  imageServerGateway: require('./lib/gateways/ImageServerGateway')
};
const { getDocumentMetadata, getDocument } = require('./lib/use-cases')(
  gateways
);

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
    const mimeType = mimeTypes.lookup(metadata.extension);
    const doc = await getDocument(metadata.imageId);
    res.set('Content-Type', mimeType);
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
