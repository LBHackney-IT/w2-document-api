const DocumentType = {
  PhoneCall: 'C',
  InPerson: 'P',
  CalcReport: 'R',
  Link: 'L',
  Scanned: 'S',
  External: 'X',
  Email: 'E',
  ManualProcess: 'M',
  OutputDocument: 'O'
};

const FileType = {
  [DocumentType.PhoneCall]: 'xml',
  [DocumentType.InPerson]: 'xml',
  [DocumentType.CalcReport]: 'xml',
  [DocumentType.Link]: 'xml',
  [DocumentType.Scanned]: 'pdf',
  [DocumentType.External]: null,
  [DocumentType.Email]: null,
  [DocumentType.ManualProcess]: 'xml',
  [DocumentType.OutputDocument]: 'rtf'
};

module.exports = { DocumentType, FileType };
