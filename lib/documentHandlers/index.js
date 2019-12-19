module.exports = function(options) {
  const xml = require('./Xml')(options);
  return {
    Email: require('./Email')(options),
    External: require('./External')(options),
    Output: require('./Output')(options),
    Scanned: require('./Scanned')(options),
    PhoneCall: xml,
    InPerson: xml,
    CalcReport: xml,
    Link: xml,
    ManualProcess: xml
  };
};
