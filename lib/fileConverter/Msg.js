const MsgReader = require('@freiraum/msgreader');

module.exports = async function(doc) {
  const msgFileBuffer = Buffer.from(doc);
  const msg = new MsgReader(msgFileBuffer);
  return { mimeType: 'text/plain', doc: msg.getFileData().body };
};
