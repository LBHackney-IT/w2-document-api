const { W2DocExtensionLookup } = require('@lib/Constants');

module.exports = function(options) {
  const cacheGateway = options.cacheGateway;
  const documentHandlers = options.documentHandlers;

  return async function(metadata) {
    let document = await cacheGateway.get(metadata.id);
    if (!document) {
      document = await documentHandlers[metadata.type](metadata);

      await cacheGateway.put(metadata.id, document);
    }

    if (document && document.doc.length > 6000000) {
      document.url = await cacheGateway.getUrl(
        metadata.id,
        document.mimeType,
        W2DocExtensionLookup[metadata.type] || metadata.extension || ''
      );
    }
    return document;
  };
};
