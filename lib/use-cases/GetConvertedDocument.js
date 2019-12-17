module.exports = function(options) {
  const documentHandlers = require('../documentHandlers')(options);
  return async function(metadata) {
    return await documentHandlers[metadata.type](metadata);
  };
};
