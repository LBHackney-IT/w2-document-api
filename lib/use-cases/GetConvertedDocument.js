module.exports = function(options) {
  const documentHandlers = require('../documentHandlers')(options);
  return async function(metadata) {
    // check cache here

    return await documentHandlers[metadata.type](metadata);
  };
};
