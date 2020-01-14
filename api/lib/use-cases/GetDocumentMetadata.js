const { W2DocType } = require('../Constants');

module.exports = function(options) {
  const dbGateway = options.dbGateway;

  return async function(id) {
    const metadata = await dbGateway.getDocumentMetadata(id);

    metadata.type = W2DocType[metadata.type];

    if (metadata.type === 'Scanned') {
      metadata.pages = await dbGateway.getDocumentPages(metadata.id);
    }
    if (metadata.type === 'Email') {
      metadata.emailMetadata = await dbGateway.getEmailMetadata(
        metadata.imageId
      );
      metadata.emailMetadata.attachments = await dbGateway.getEmailAttachments(
        metadata.imageId
      );
      metadata.imageId = null;
    }
    return metadata;
  };
};
