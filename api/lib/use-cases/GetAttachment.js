const mimeTypes = require('mime-types');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;
  const dbGateway = options.dbGateway;

  return async function(imageId) {
    const outputDoc = await imageServerGateway.getDocument(imageId);
    const metadata = await dbGateway.getEmailAttachmentMetadata(imageId);
    let filename = '';
    let mimeType = '';
    if (metadata.length > 0) {
      filename = metadata[0].name;
      mimeType = mimeTypes.lookup(filename);
    }
    return {
      doc: outputDoc,
      filename: filename,
      mimeType: mimeType
    };
  };
};
