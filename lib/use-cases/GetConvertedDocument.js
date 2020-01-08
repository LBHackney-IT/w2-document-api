module.exports = function(options) {
  const cacheGateway = options.cacheGateway;

  return async function(metadata) {
    // check cache here
    const cached = await cacheGateway.get(metadata.id);

    if (cached) return cached;

    const newDoc = await options.documentHandlers[metadata.type](metadata);
    await cacheGateway.put(metadata.id, newDoc);
    return newDoc;
  };
};
