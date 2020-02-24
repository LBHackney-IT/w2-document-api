const { MimeType } = require('@lib/Constants');

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
    if (data.attachments)
      data.attachments.forEach(a => {
        a.system = process.env.URL_PREFIX;
      });
    const doc = emailTemplate(data);
    return { mimeType: MimeType.Html, doc };
  };
};
