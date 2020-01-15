const imagesToPDF = require('@lib/imagesToPdf');
const { MimeType } = require('@lib/Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    // Download each of the pages
    const docs = [];
    for (const page of metadata.pages) {
      const docFetcher = async () => {
        return await imageServerGateway.getDocument(page.imageId);
      };
      docs.push(docFetcher);
    }
    // Turn into pdf
    const outputDoc = await imagesToPDF(docs);
    return { mimeType: MimeType.Pdf, doc: outputDoc };
  };
};
