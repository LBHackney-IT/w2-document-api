module.exports = function(options) {
  const cacheGateway = options.cacheGateway;
  const documentHandlers = options.documentHandlers;

  return async function(metadata) {
    let document = await cacheGateway.get(metadata.id);
    console.log('-----DOC FROM CACHE-----');
    console.log(document);
    console.log('-----DOC FROM CACHE-----');
    if (!document) {
      document = await documentHandlers[metadata.type](metadata);

      await cacheGateway.put(metadata.id, document);
    }

    if (document.doc.length > 6000000) {
      document.url = await cacheGateway.getUrl(metadata.id);
    }
    return document;
  };
};
