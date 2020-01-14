const mimeTypes = require('mime-types');

const passthrough = extension => {
  return async doc => {
    return { mimeType: mimeTypes.lookup(extension), doc };
  };
};

const converters = {
  rtf: require('./Rtf'),
  xml: require('./Xml'),
  msg: require('./Msg'),
  pdf: passthrough('pdf'),
  jpg: passthrough('jpg'),
  jpeg: passthrough('jpg'),
  htm: passthrough('htm'),
  html: passthrough('html'),
  txt: passthrough('txt'),
  png: passthrough('png')
};

module.exports = async function(doc, extension) {
  const docExtension = extension.toLowerCase();
  if (converters[docExtension]) {
    try {
      return await converters[docExtension](doc);
    } catch (err) {
      console.log(err);
    }
  }
};
