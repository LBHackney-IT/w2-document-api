const PDFDocument = require('pdfkit');
const imageType = require('image-type');
const sharp = require('sharp');

module.exports = async function ImagesToPDF(imageFiles) {
  const pdfGenerator = doc => {
    return new Promise((resolve, reject) => {
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

  const doc = new PDFDocument({ autoFirstPage: false });

  for (let imgFetcher of imageFiles) {
    try {
      let img = await imgFetcher();
      if (imageType(img).mime !== 'image/jpeg') {
        img = await sharp(img)
          .jpeg({ quality: 70 })
          .toBuffer();
      }
      const pdfImg = doc.openImage(img);
      doc.addPage({ size: [pdfImg.width, pdfImg.height] });
      doc.image(pdfImg, 0, 0);
    } catch (err) {
      console.log(err);
      return;
    }
  }

  return await pdfGenerator(doc);
};
