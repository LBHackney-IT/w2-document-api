const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);

const imageServerGateway = require('../../../lib/gateways/FSImageServerGateway')();
const External = require('../../../lib/documentHandlers/External');

describe('ExternalDocumentHandler', function() {
  it('returns the original document from the image server', async function() {
    const imageId = 1;
    const handler = External({ imageServerGateway });

    const originalFile = await readFile(
      path.join(__dirname, `../../test-data/images/${imageId}`)
    );

    const metadata = { imageId, extension: 'jpg' };

    const convertedFile = await handler(metadata);

    expect(originalFile.equals(convertedFile.doc)).toBe(true);
    expect(convertedFile.mimeType).toBe('image/jpeg');
  });
});
