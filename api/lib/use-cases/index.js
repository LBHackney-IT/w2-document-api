function initUseCases(options) {
  return {
    getDocumentMetadata: require('./GetDocumentMetadata')(options),
    getConvertedDocument: require('./GetConvertedDocument')(options),
    getOriginalDocument: require('./GetOriginalDocument')(options)
  };
}

module.exports = initUseCases;
