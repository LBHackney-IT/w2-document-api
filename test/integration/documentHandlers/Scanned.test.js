const fs = require('fs');
const PDFParser = require('pdf2json');

const imageServerGateway = require('../../../lib/gateways/FSImageServerGateway')();
const Scanned = require('../../../lib/documentHandlers/Scanned');

describe('ScannedDocumentHandler', function() {
  let handler;
  let metadata;
  const tempPath = 'test/test-data/tmp';

  beforeEach(async () => {
    handler = Scanned({ imageServerGateway, tempPath });

    metadata = {
      id: 1,
      pages: [
        { imageId: 1, page: 1 },
        { imageId: 2, page: 2 }
      ]
    };

    await fs.promises.rmdir(tempPath, { recursive: true });
    await fs.promises.mkdir(tempPath, { recursive: true });

    const tempFiles = await fs.promises.readdir(tempPath);
    expect(tempFiles.length).toBe(0);
  });

  it('returns a pdf containing all the documents pages', async function(done) {
    const convertedFile = await handler(metadata);

    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataReady', data => {
      expect(data.formImage.Pages.length).toBe(metadata.pages.length);
      done();
    });

    pdfParser.parseBuffer(convertedFile.doc);
  });

  it('cleans up temp files', async function() {
    await handler(metadata);

    const tempFiles = await fs.promises.readdir(tempPath);
    expect(tempFiles.length).toBe(0);
  });
});
