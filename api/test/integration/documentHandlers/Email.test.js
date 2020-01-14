const imageServerGateway = require('../../../lib/gateways/FSImageServerGateway')();
const Email = require('../../../lib/documentHandlers/Email');
const { loadTemplates } = require('../../../lib/Utils');
const { emailTemplate } = loadTemplates('api/lib/templates');

describe('EmailDocumentHandler', function() {
  it('renders the email text into the template', async function() {
    const imageId = 3;
    const handler = Email({ imageServerGateway, emailTemplate });

    const metadata = {
      emailMetadata: {
        imageId,
        sender: 'test@test.com',
        recipient: 'user@user.com',
        attachments: []
      }
    };

    const convertedFile = await handler(metadata);

    expect(convertedFile.doc).toMatch('This is a test email');
    expect(convertedFile.doc).toMatch(metadata.emailMetadata.sender);
    expect(convertedFile.doc).toMatch(metadata.emailMetadata.recipient);
    expect(convertedFile.mimeType).toBe('text/html');
  });
});
