function initUseCases(options) {
  return {
    getDocumentMetadata: require('./GetDocumentMetadata')(options),
    getDocument: require('./GetDocument')(options),
    getOriginalDocument: require('./GetOriginalDocument')(options)
  };
}

module.exports = initUseCases;
