const request = require('request-promise');

module.exports = function(config) {
  return {
    getDocument: async function(id) {
      return await request.get({
        url: `${config.imageServerUrl}${id}`,
        encoding: null
      });
    }
  };
};
