const Email = require('../../../lib/documentHandlers/Email');
const { MimeType } = require('../../../lib/Constants');

describe('EmailHandler', function() {
  it('can process an email document', async function() {
    const emailTemplate = jest.fn();
    const imageServerGateway = {
      getDocument: jest.fn(() => {
        return {};
      })
    };
    const handler = Email({ emailTemplate, imageServerGateway });
    const metadata = {
      emailMetadata: {
        imageId: 1,
        attachments: {}
      }
    };

    const result = await handler(metadata);

    expect(imageServerGateway.getDocument).toHaveBeenCalledWith(
      metadata.emailMetadata.imageId
    );
    expect(emailTemplate).toHaveBeenCalledWith({
      imageId: 1,
      attachments: {},
      content: {}
    });
    expect(result.mimeType).toBe(MimeType.Html);
  });
});
