const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const fs = require('fs');

module.exports = function ImagesToPDF(images, outFile) {
  let doc;
  images.forEach((file, index) => {
    try {
      const size = sizeOf(file);
      if (index === 0) {
        doc = new PDFDocument({
          size: [size.width, size.height]
        });
      } else {
        doc.addPage({ size: [size.width, size.height] });
      }

      doc.image(file, 0, 0, { width: size.width, height: size.height });
    } catch (err) {
      console.log(err);
      return;
    }
  });
  doc.pipe(fs.createWriteStream(outFile));
  doc.end();
}