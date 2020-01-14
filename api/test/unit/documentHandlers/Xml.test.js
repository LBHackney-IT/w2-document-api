const Xml = require('@lib/documentHandlers/Xml');
const { MimeType } = require('@lib/Constants');

describe('XmlHandler', function() {
  it('can process an xml document', async function() {
    const imageServerGateway = {
      getDocument: jest.fn()
    };
    const handler = Xml({ imageServerGateway });
    const metadata = {
      imageId: 1
    };

    const result = await handler(metadata);

    expect(imageServerGateway.getDocument).toHaveBeenCalledWith(
      metadata.imageId
    );
    expect(result.mimeType).toBe(MimeType.PlainText);
  });
});
