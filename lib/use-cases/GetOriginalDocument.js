const mimeTypes = require('mime-types');
const { DocumentType, FileType } = require('../Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    if (metadata.type === DocumentType.Scanned) {
      // return the pdf
    }

    const fileType = FileType[metadata.type] || metadata.extension;
    const mimeType = mimeTypes.lookup(fileType) || 'application/octet-stream';
    const outputDoc = await imageServerGateway.getDocument(metadata.imageId);

    return { mimeType, doc: outputDoc, filename: `${metadata.id}.${fileType}` };
  };
};
