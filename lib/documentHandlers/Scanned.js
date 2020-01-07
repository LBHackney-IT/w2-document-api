const fs = require('fs');
const util = require('util');
const imageType = require('image-type');
const imagesToPdf = require('images-to-pdf');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const { MimeType } = require('../Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;
  const tempPath = options.tempPath;

  return async function(metadata) {
    // Create temp directory
    const tempDir = `${tempPath}/${metadata.id}`;
    await mkdir(tempDir, { recursive: true });
    // Download each of the pages
    const paths = [];
    for (const page of metadata.pages) {
      const doc = await imageServerGateway.getDocument(page.imageId);
      const type = imageType(doc);
      const path = `${tempDir}/${page.page}.${type.ext}`;
      await writeFile(path, doc);
      paths.push(path);
    }
    // Turn into pdf
    const pdfPath = `${tempDir}/combined.pdf`;
    await imagesToPdf(paths, pdfPath);
    const outputDoc = await readFile(pdfPath);
    await fs.promises.rmdir(tempDir, { recursive: true });
    return { mimeType: MimeType.Pdf, doc: outputDoc };
  };
};
