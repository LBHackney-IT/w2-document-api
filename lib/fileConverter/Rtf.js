const util = require('util');
const rtfToHTML = require('@iarna/rtf-to-html');
const convertRtf = util.promisify(rtfToHTML.fromString);
const { MimeType } = require('../Constants');

module.exports = async function(doc) {
  const converted = await convertRtf(doc);
  return { mimeType: MimeType.Html, doc: converted };
};
