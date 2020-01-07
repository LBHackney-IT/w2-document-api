const { MimeType } = require('../Constants');

module.exports = function(options) {
  const emailTemplate = options.emailTemplate;
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const content = await imageServerGateway.getDocument(
      metadata.emailMetadata.imageId
    );
    const data = {
      ...metadata.emailMetadata,
      content
    };
    const doc = emailTemplate(data);
    return { mimeType: MimeType.Html, doc };
  };
};
