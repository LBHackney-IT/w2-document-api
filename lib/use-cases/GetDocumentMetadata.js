function GetDocumentMetadata(options) {
  const dbGateway = options.dbGateway;

  return async function(id) {
    return await dbGateway.getDocumentMetadata(id);
  };
}

module.exports = GetDocumentMetadata;
