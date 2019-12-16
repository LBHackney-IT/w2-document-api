function initUseCases(options) {
  return {
    getDocumentMetadata: require('./GetDocumentMetadata')(options),
    getDocument: require('./GetDocument')(options)
  };
}

module.exports = initUseCases;
