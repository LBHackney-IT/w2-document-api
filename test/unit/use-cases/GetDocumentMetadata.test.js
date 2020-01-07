const GetDocumentMetadata = require('../../../lib/use-cases/GetDocumentMetadata');

describe('GetDocumentMetadata', function() {
  const createDbGateway = docType => {
    return {
      getDocumentMetadata: jest.fn(id => {
        return {
          id: id,
          type: docType
        };
      }),
      getDocumentPages: jest.fn(),
      getEmailMetadata: jest.fn(() => {
        return {
          emailMetadata: {}
        };
      }),
      getEmailAttachments: jest.fn()
    };
  };

  it('gets the document metadata', async function() {
    const id = 1;
    const dbGateway = createDbGateway('X');
    const usecase = GetDocumentMetadata({ dbGateway });

    const metadata = await usecase(id);

    expect(dbGateway.getDocumentMetadata).toHaveBeenCalledTimes(1);
    expect(metadata.id).toBe(id);
  });

  it('gets the document pages when type is scanned document', async function() {
    const dbGateway = createDbGateway('S');
    const usecase = GetDocumentMetadata({ dbGateway });

    await usecase();

    expect(dbGateway.getDocumentPages).toHaveBeenCalledTimes(1);
  });

  it('gets the email metadata and attachments when type is email', async function() {
    const dbGateway = createDbGateway('E');
    const usecase = GetDocumentMetadata({ dbGateway });

    await usecase();

    expect(dbGateway.getEmailMetadata).toHaveBeenCalledTimes(1);
    expect(dbGateway.getEmailAttachments).toHaveBeenCalledTimes(1);
  });
});
