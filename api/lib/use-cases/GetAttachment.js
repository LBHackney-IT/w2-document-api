module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(imageId) {
    const outputDoc = await imageServerGateway.getDocument(imageId);

    return {
      doc: outputDoc
    };
  };
};
