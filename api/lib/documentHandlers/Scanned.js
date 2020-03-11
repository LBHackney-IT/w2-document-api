const imagesToPDF = require('@lib/imagesToPdf');
const { MimeType } = require('@lib/Constants');

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    if (metadata.pages.length === 0) {
      // not actually a scan
      const buffer = await imageServerGateway.getDocument(metadata.imageId);
      return {
        mimeType: MimeType.PlainText,
        doc: buffer.toString('utf-8')
      };
    }

    const imageFetchers = metadata.pages.map(page => async () => {
      return imageServerGateway.getDocument(page.imageId);
    });

    // Turn into pdf
    return { mimeType: MimeType.Pdf, doc: await imagesToPDF(imageFetchers) };
  };
};
