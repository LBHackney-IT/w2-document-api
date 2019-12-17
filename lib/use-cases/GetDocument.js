const mimeTypes = require('mime-types');
const fs = require('fs');
const util = require('util');
const imageType = require('image-type');
const imagesToPdf = require('images-to-pdf');
const rtfToHTML = require('@iarna/rtf-to-html');
const { DocumentType } = require('../Constants');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const convertRtf = util.promisify(rtfToHTML.fromString);

function GetDocument(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    let mimeType = 'application/pdf';
    let outputDoc;

    switch (metadata.type) {
      case DocumentType.External:
        mimeType = mimeTypes.lookup(metadata.extension);
        outputDoc = await imageServerGateway.getDocument(metadata.imageId);
        return { mimeType, doc: outputDoc };

      case DocumentType.Scanned:
        mimeType = 'application/pdf';
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
        return { mimeType, doc: outputDoc };

      case DocumentType.OutputDocument:
        mimeType = 'text/html';
        let doc = await imageServerGateway.getDocument(metadata.imageId);
        outputDoc = await convertRtf(doc);
        return { mimeType, doc: outputDoc };

      default:
        break;
    }

    return { mimeType, doc: outputDoc };
  };
}

module.exports = GetDocument;
