module.exports = function(options) {
  const cacheGateway = options.cacheGateway;
  const documentHandlers = options.documentHandlers;

  return async function(metadata) {
    const cached = await cacheGateway.get(metadata.id);
    if (cached) return cached;

    const newDoc = await documentHandlers[metadata.type](metadata);
    await cacheGateway.put(metadata.id, newDoc);
    return newDoc;
  };
};
