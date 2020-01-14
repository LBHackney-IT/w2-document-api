const { MimeType } = require('@lib/Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const doc = await imageServerGateway.getDocument(metadata.imageId);
    return { mimeType: MimeType.PlainText, doc };
  };
};
