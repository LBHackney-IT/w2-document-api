const GetAttachment = require('@lib/use-cases/GetAttachment');

describe('GetAttachment', function() {
  const createDbGateway = imageId => {
    return {
      getEmailAttachmentMetadata: jest.fn(() => {
        return [{ id: 278400, imageId: imageId, name: 'Scanned.pdf' }];
      })
    };
  };

  const createImageServerGateway = document => {
    return {
      getDocument: jest.fn(() => {
        return document;
      })
    };
  };

  it('gets the attachment metadata and document', async function() {
    const imageId = 1234;
    const dbGateway = createDbGateway(imageId);
    const document = 'some document';
    const imageServerGateway = createImageServerGateway(document);
    const usecase = GetAttachment({ imageServerGateway, dbGateway });

    const attachment = await usecase(imageId);

    expect(dbGateway.getEmailAttachmentMetadata).toHaveBeenCalledTimes(1);
    expect(imageServerGateway.getDocument).toHaveBeenCalledTimes(1);

    expect(attachment.doc).toBe(document);
    expect(attachment.filename).toBe('Scanned.pdf');
    expect(attachment.mimeType).toBe('application/pdf');
  });
});
