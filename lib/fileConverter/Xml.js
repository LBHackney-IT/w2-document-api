const { MimeType } = require('../Constants');

module.exports = async function(doc) {
  return { mimeType: MimeType.PlainText, doc };
};
