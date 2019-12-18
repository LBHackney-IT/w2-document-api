const util = require('util');
const rtfToHTML = require('@iarna/rtf-to-html');
const convertRtf = util.promisify(rtfToHTML.fromString);

module.exports = async function(doc) {
  const converted = await convertRtf(doc);
  return { mimeType: 'text/html', doc: converted };
};
