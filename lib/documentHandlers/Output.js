const util = require('util');
const rtfToHTML = require('@iarna/rtf-to-html');
const convertRtf = util.promisify(rtfToHTML.fromString);

module.exports = function(options) {
  const imageServerGateway = options.imageServerGateway;

  return async function(metadata) {
    const rawDoc = await imageServerGateway.getDocument(metadata.imageId);

    const isRtf = String.fromCharCode(rawDoc[0]) === '{';

    if (isRtf) {
      const doc = await convertRtf(rawDoc);
      return { mimeType: 'text/html', doc };
    }

    return { mimeType: 'text/plain', doc: rawDoc };
  };
};
