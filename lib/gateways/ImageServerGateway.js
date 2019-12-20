const request = require('request-promise');

module.exports = {
  getDocument: async function(id) {
    return await request.get({
      url: `${process.env.W2_IMAGE_SERVER_URL}${id}`,
      encoding: null
    });
  }
};
