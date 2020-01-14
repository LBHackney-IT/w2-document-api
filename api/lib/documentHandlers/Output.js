const fileConverter = require('@lib/fileConverter');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const doc = await imageServerGateway.getDocument(metadata.imageId);
    const extension = String.fromCharCode(doc[0]) === '{' ? 'rtf' : 'xml';
    return fileConverter(doc, extension);
  };
};
