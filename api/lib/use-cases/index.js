function initUseCases(options) {
  return {
    getCustomerDocuments: require('./GetCustomerDocuments')(options),
    getDocumentMetadata: require('./GetDocumentMetadata')(options),
    getConvertedDocument: require('./GetConvertedDocument')(options),
    getOriginalDocument: require('./GetOriginalDocument')(options),
    getAttachment: require('./GetAttachment')(options)
  };
}

module.exports = initUseCases;
