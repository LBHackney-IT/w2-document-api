const DocSystems = {
  uhw: 'UHW',
  hncomino: 'COMINO'
};

const W2DocType = {
  C: 'PhoneCall',
  P: 'InPerson',
  R: 'CalcReport',
  L: 'Link',
  S: 'Scanned',
  X: 'External',
  E: 'Email',
  M: 'ManualProcess',
  O: 'Output'
};

const W2DocExtensionLookup = {
  PhoneCall: 'xml',
  InPerson: 'xml',
  CalcReport: 'xml',
  Link: 'xml',
  Scanned: 'pdf',
  External: null,
  Email: null,
  ManualProcess: 'xml',
  Output: 'rtf'
};

const MimeType = {
  Default: 'application/octet-stream',
  Html: 'text/html',
  Pdf: 'application/pdf',
  PlainText: 'text/plain'
};

module.exports = { DocSystems, MimeType, W2DocType, W2DocExtensionLookup };
