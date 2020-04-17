const request = require('request-promise');
const { MimeType } = require('@lib/Constants');

module.exports = async function(doc) {
  const requestOptions = {
    body: doc,
    headers: {
      'Content-Type': 'application/rtf'
    },
    method: 'POST',
    uri: process.env.RTF_TO_HTML_URL
  };

  const converted = await request.post(requestOptions);

  return { mimeType: MimeType.Html, doc: converted };
};
