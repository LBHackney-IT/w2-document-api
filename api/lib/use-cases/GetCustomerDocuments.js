module.exports = function(options) {
  const dbGateway = options.dbGateway;

  return async function(id, ref) {
    return await dbGateway.getCustomerDocuments(id, ref);
  };
};
