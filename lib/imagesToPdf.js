const PDFDocument = require('pdfkit');

module.exports = async function ImagesToPDF(imageFiles) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: false });

    imageFiles.forEach(file => {
      try {
        const img = doc.openImage(file);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(img, 0, 0);
      } catch (err) {
        console.log(err);
        return;
      }
    });

    doc.end();

    const chunks = [];
    doc.on('data', chunks.push.bind(chunks));
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', () => {
      reject();
    });
  });
};
