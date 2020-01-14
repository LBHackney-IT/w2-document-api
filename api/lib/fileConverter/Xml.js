const { MimeType } = require('@lib/Constants');

module.exports = async function(doc) {
  return { mimeType: MimeType.PlainText, doc };
};
