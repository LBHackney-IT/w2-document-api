const request = require('request-promise');

const ImageServerGateway = {
  getDocument: async function(id) {
    const url = `${process.env.W2_IMAGE_SERVER_URL}${id}`;
    const options = { url, resolveWithFullResponse: true, encoding: null };
    const httpResponse = await request.get(options);
    return httpResponse.body;
  }
};

module.exports = ImageServerGateway;
