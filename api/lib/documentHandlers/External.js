const fileConverter = require('../fileConverter');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const doc = await imageServerGateway.getDocument(metadata.imageId);
    return fileConverter(doc, metadata.extension);
  };
};
