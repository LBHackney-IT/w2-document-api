const path = require('path');
const { loadTemplates } = require('../Utils');
const { MimeType } = require('../Constants');

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
      attachments: metadata.emailMetadata.attachments
    };
    const doc = emailTemplate(data);
    return { mimeType: MimeType.Html, doc };
  };
};
