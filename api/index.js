require('module-alias/register');
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const {
  getCustomerDocuments,
  getDocumentMetadata,
  getConvertedDocument,
  getOriginalDocument,
  getAttachment,
  templates
} = require('@lib/Dependencies');

let Sentry;
if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
  Sentry = require('@sentry/node');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV
  });

  app.use(Sentry.Handlers.requestHandler());
}

app.use(function(req, res, next) {
  // had to rewrite the path to get it playing nice with a not-root resource in api gateway
  req.url = req.url.replace(`/${process.env.URL_PREFIX}`, '');
  next();
});

app.get('/attachments/:imageId/download', async (req, res, next) => {
  try {
    const converted = await getAttachment(req.params.imageId);
    res.send(converted.doc);
  } catch (err) {
    next(err);
  }
});

app.get('/attachments/:imageId/view', async (req, res, next) => {
  try {
    const attachment = await getAttachment(req.params.imageId);
    if (attachment) {
      res.type(attachment.mimeType);
      res.end(attachment.doc, 'binary');
    }
  } catch (err) {
    next(err);
  }
});

app.get('/customers/:id/documents', async (req, res, next) => {
  try {
    const system = process.env.URL_PREFIX;
    const documents = await getCustomerDocuments(req.params.id, system);
    res.send(documents);
  } catch (err) {
    next(err);
  }
});

app.get('/documents/:id', async (req, res, next) => {
  try {
    const metadata = await getDocumentMetadata(req.params.id);
    res.send(metadata);
  } catch (err) {
    next(err);
  }
});

app.get('/documents/:id/download', async (req, res, next) => {
  try {
    const metadata = await getDocumentMetadata(req.params.id);
    const { mimeType, doc, filename } = await getOriginalDocument(metadata);
    res.set('Content-Type', mimeType);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(doc);
  } catch (err) {
    next(err);
  }
});

app.get('/documents/:id/view', async (req, res, next) => {
  try {
    const metadata = await getDocumentMetadata(req.params.id);
    const converted = await getConvertedDocument(metadata);
    if (converted) {
      if (converted.url)
        return res.send(templates.downloadTemplate({ url: converted.url }));
      res.set('Content-Type', converted.mimeType);
      res.send(converted.doc);
    } else {
      res.send(
        templates.downloadTemplate({
          id: req.params.id,
          system: process.env.URL_PREFIX
        })
      );
    }
  } catch (err) {
    next(err);
  }
});

if (Sentry) {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(err) {
        return true;
      }
    })
  );
}

app.use(function(err, req, res, next) {
  console.log(err);
  res.sendStatus(500);
});

module.exports = {
  handler: serverless(app, {
    binary: ['*/*']
  }),
  app
};
