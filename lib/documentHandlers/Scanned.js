const fs = require('fs');
const util = require('util');
const imageType = require('image-type');
const imagesToPdf = require('images-to-pdf');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    // Create temp directory
    await mkdir(`./tmp/${metadata.id}`, { recursive: true });
    // Download each of the pages
    let paths = [];
    for (let page of metadata.pages) {
      let doc = await imageServerGateway.getDocument(page.imageId);
      let type = imageType(doc);
      let path = `./tmp/${metadata.id}/${page.page}.${type.ext}`;
      await writeFile(path, doc);
      paths.push(path);
    }
    // Turn into pdf
    let pdfPath = `./tmp/${metadata.id}/combined.pdf`;
    await imagesToPdf(paths, pdfPath);
    outputDoc = await readFile(pdfPath);
    return { mimeType: 'application/pdf', doc: outputDoc };
  };
};
