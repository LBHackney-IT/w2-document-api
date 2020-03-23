const mimeTypes = require('mime-types');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;
  const dbGateway = options.dbGateway;

  return async function(imageId) {
    const outputDoc = await imageServerGateway.getDocument(imageId);
    const metadata = await dbGateway.getEmailAttachmentMetadata(imageId);
    const name = metadata[0].name;
    const mimeType = mimeTypes.lookup(name);
    return {
      doc: outputDoc,
      filename: name,
      mimeType: mimeType
    };
  };
};
