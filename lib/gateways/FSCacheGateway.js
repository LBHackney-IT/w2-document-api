const cache = require('node-cache');

module.exports = function(config) {
  return {
    get: async function(id) {
      return;
    },
    put: async function(id, document) {}
  };
};
