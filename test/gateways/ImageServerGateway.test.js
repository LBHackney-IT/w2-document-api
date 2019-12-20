jest.mock('request');
const imageServerUrl = 'http://dummy-url.com/?';
const request = require('request-promise');
const gateway = require('../../lib/gateways/ImageServerGateway')({
  imageServerUrl
});

describe('ImageServerGateway', function() {
  it('makes the correct request and returns the response', async function() {
    const id = 123;
    const dummyContent = 'DUMMY CONTENT';
    request.get.mockReturnValue(Promise.resolve(dummyContent));
    const response = await gateway.getDocument(id);
    expect(request.get).toHaveBeenCalledTimes(1);
    expect(request.get).toHaveBeenCalledWith({
      url: `${imageServerUrl}${id}`,
      encoding: null
    });
    expect(response).toBe(dummyContent);
  });
});
