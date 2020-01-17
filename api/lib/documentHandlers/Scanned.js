const imagesToPDF = require('@lib/imagesToPdf');
const { MimeType } = require('@lib/Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    // Download each of the pages
    const imageFetchers = [];
    for (const page of metadata.pages) {
      imageFetchers.push(async () => {
        return await imageServerGateway.getDocument(page.imageId);
      });
    }
    // Turn into pdf
    const outputDoc = await imagesToPDF(imageFetchers);
    return { mimeType: MimeType.Pdf, doc: outputDoc };
  };
};
