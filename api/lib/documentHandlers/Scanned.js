const fs = require('fs');
const imageType = require('image-type');
const imagesToPDF = require('../imagesToPdf');
const { MimeType } = require('../Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;
  const tempPath = options.tempPath;

  return async function(metadata) {
    // Create temp directory
    const tempDir = `${tempPath}/${metadata.id}`;
    await fs.promises.mkdir(tempDir, { recursive: true });
    // Download each of the pages
    const paths = [];
    for (const page of metadata.pages) {
      const doc = await imageServerGateway.getDocument(page.imageId);
      const type = imageType(doc);
      const path = `${tempDir}/${page.page}.${type.ext}`;
      await fs.promises.writeFile(path, doc);
      paths.push(path);
    }
    // Turn into pdf
    const outputDoc = await imagesToPDF(paths);
    await fs.promises.rmdir(tempDir, { recursive: true });
    return { mimeType: MimeType.Pdf, doc: outputDoc };
  };
};
