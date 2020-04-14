const path = require('path');
const { loadSQL } = require('@lib/Utils');
const W2Gateway = require('@lib/gateways/W2Gateway');

const {
  getCustomerDocumentsSQL,
  getDocumentMetadataSQL,
  getDocumentPagesSQL,
  getEmailAttachmentsSQL,
  getEmailAttachmentMetadataSQL,
  getEmailMetadataSQL
} = loadSQL(path.join(__dirname, '../../../lib/sql'));

describe('W2Gateway', function() {
  const system = 'uhw';
  const id = 123;
  const sqlParams = [{ id: 'id', type: 'Int', value: id }];
  const dbConn = (isSuccess, returnsArray) => {
    return {
      request: jest.fn(() => {
        if (returnsArray) {
          return isSuccess ? [{ DocNo: id }] : [];
        }
        if (isSuccess) {
          return { DocNo: id };
        }
      })
    };
  };

  const expectSuccess = (req, res, sql) => {
    expect(req).toHaveBeenCalledWith(sql, sqlParams);
    expect(res.DocNo).toBe(id);
  };

  const expectFailure = (req, res, sql) => {
    expect(req).toHaveBeenCalledWith(sql, [
      { id: 'id', type: 'Int', value: id }
    ]);
    expect(res).toBeUndefined();
  };

  it('can get customer documents', async function() {
    const dbConnection = dbConn(true, true);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getCustomerDocuments(id, system);

    expect(dbConnection.request).toHaveBeenCalledWith(
      getCustomerDocumentsSQL,
      sqlParams
    );
    expect(response[0].id).toBe(id);
  });

  it('can get document metadata', async function() {
    const dbConnection = dbConn(true, true);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getDocumentMetadata(id);

    expectSuccess(dbConnection.request, response, getDocumentMetadataSQL);
  });

  it('returns undefined if cant fetch document metadata', async function() {
    const dbConnection = dbConn(false, true);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getDocumentMetadata(id);

    expectFailure(dbConnection.request, response, getDocumentMetadataSQL);
  });

  it('can get document pages', async function() {
    const dbConnection = dbConn(true, false);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getDocumentPages(id);

    expectSuccess(dbConnection.request, response, getDocumentPagesSQL);
  });

  it('returns undefined if cant fetch document pages', async function() {
    const dbConnection = dbConn(false, false);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getDocumentPages(id);

    expectFailure(dbConnection.request, response, getDocumentPagesSQL);
  });

  it('can get email attachments', async function() {
    const dbConnection = dbConn(true, false);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getEmailAttachments(id);

    expectSuccess(dbConnection.request, response, getEmailAttachmentsSQL);
  });

  it('can get email attachment metadata', async function() {
    const dbConnection = dbConn(true, false);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getEmailAttachmentMetadata(id);

    expectSuccess(
      dbConnection.request,
      response,
      getEmailAttachmentMetadataSQL
    );
  });

  it('returns undefined if cant fetch email attachments', async function() {
    const dbConnection = dbConn(false, false);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getEmailAttachments(id);

    expectFailure(dbConnection.request, response, getEmailAttachmentsSQL);
  });

  it('can get email metadata', async function() {
    const dbConnection = dbConn(true, true);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getEmailMetadata(id);

    expectSuccess(dbConnection.request, response, getEmailMetadataSQL);
  });

  it('returns undefined if cant fetch email metadata', async function() {
    const dbConnection = dbConn(false, true);
    const gateway = W2Gateway({ dbConnection });
    const response = await gateway.getEmailMetadata(id);

    expectFailure(dbConnection.request, response, getEmailMetadataSQL);
  });
});
