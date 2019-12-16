function GetDocument(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(id) {
    return await imageServerGateway.getDocument(id);
  };
}

module.exports = GetDocument;
