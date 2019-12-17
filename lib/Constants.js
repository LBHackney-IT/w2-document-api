const DocumentType = {
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

const FileType = {
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

module.exports = { DocumentType, FileType };
