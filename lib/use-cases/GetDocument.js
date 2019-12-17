const mimeTypes = require('mime-types');
const fs = require('fs');
const util = require('util');
const imageType = require('image-type');
const imagesToPdf = require('images-to-pdf');
const { FileType } = require('../Constants');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

function GetDocument(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    let mimeType = 'application/pdf';
    let doc;

    if (metadata.type === FileType.External) {
      mimeType = mimeTypes.lookup(metadata.extension);
      doc = await imageServerGateway.getDocument(metadata.imageId);
    } else if (metadata.type === FileType.Scanned) {
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
      doc = await readFile(pdfPath);
    }

    return { mimeType, doc };
  };
}

module.exports = GetDocument;
