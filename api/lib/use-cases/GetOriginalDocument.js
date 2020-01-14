const mimeTypes = require('mime-types');
const { MimeType, W2DocType, W2DocExtensionLookup } = require('@lib/Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    if (metadata.type === W2DocType.Scanned) {
      // return the pdf
    }

    const fileExt = W2DocExtensionLookup[metadata.type] || metadata.extension;
    const mimeType = mimeTypes.lookup(fileExt) || MimeType.Default;
    const outputDoc = await imageServerGateway.getDocument(metadata.imageId);

    return {
      mimeType,
      doc: outputDoc,
      filename: `${metadata.id}.${fileExt}`
    };
  };
};
