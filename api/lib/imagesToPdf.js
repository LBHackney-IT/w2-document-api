const PDFDocument = require('pdfkit');
const sharp = require('sharp');

module.exports = async function ImagesToPDF(imageFetchers) {
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

  const A4Inches = [8.27, 11.69];
  const dpi = 200;
  const A4 = A4Inches.map(x => Math.ceil(x * dpi));
  let size;

  const processImage = async image => {
    let newImage = await sharp(image);
    const metadata = await newImage.metadata();
    size = metadata.width > metadata.height ? A4.reverse() : A4;

    if (metadata.width > size[0]) {
      newImage = await newImage.resize(size[0]);
    }

    if (metadata.format !== 'jpeg') {
      newImage = await newImage.jpeg({ quality: 70 });
    }

    return await newImage.toBuffer();
  };

  const doc = new PDFDocument({ autoFirstPage: false });

  for (const imageFetcher of imageFetchers) {
    try {
      const img = await processImage(await imageFetcher());
      const pdfImg = doc.openImage(img);
      doc.addPage({ size });
      doc.image(pdfImg, 0, 0, { width: size[0] });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  return await pdfGenerator(doc);
};
