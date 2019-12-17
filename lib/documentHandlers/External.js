const mimeTypes = require('mime-types');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const mimeType = mimeTypes.lookup(metadata.extension);
    const doc = await imageServerGateway.getDocument(metadata.imageId);
    return { mimeType, doc };
  };
};
