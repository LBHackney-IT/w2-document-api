module.exports = function(options) {
  const cacheGateway = options.cacheGateway;
  const documentHandlers = options.documentHandlers;

  return async function(metadata) {
    const document = await cacheGateway.get(metadata.id);

    if (!document) {
      const document = await documentHandlers[metadata.type](metadata);

      await cacheGateway.put(metadata.id, document);
    }

    if (document.doc.length > 6000000) {
      document.url = await cacheGateway.getUrl(metadata.id);
    }
    return document;
  };
};
