module.exports = function(options) {
  const dbGateway = options.dbGateway;

  return async function(id) {
    return await dbGateway.getDocumentMetadata(id);
  };
};
