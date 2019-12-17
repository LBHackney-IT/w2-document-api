const fs = require('fs');
const path = require('path');
const util = require('util');
const imageType = require('image-type');
const imagesToPdf = require('images-to-pdf');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const { loadTemplates } = require('../Utils');

const { emailTemplate } = loadTemplates(path.join(__dirname, '/../templates'));

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const content = await imageServerGateway.getDocument(
      metadata.emailMetadata.imageId
    );
    const data = {
      ...metadata.emailMetadata,
      content,
      attachments: metadata.attachments
    };
    const doc = emailTemplate(data);
    return { mimeType: 'text/html', doc };
  };
};
