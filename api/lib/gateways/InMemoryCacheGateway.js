const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 0, checkperiod: 120 });

module.exports = function() {
  return {
    get: async function(id) {
      const cachedItem = cache.get(id);
      if (cachedItem) console.log(`Got doc id=${id} from cache`);
      return cachedItem;
    },
    put: async function(id, document) {
      const success = cache.set(id, document);
      if (success) console.log(`Put doc id=${id} in cache`);
      return success;
    }
  };
};
