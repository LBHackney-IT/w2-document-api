const mssql = require('mssql');
const path = require('path');
const { loadSQL } = require('../../lib/Utils');
const W2Gateway = require('../../lib/gateways/W2Gateway');

const {
  getDocumentMetadataSQL,
  getDocumentPagesSQL,
  getEmailAttachmentsSQL,
  getEmailMetadataSQL
} = loadSQL(path.join(__dirname, '/../../lib/sql'));

describe('W2Gateway', function() {
  beforeEach(() => {});

  it('can get document metadata', async function() {
    const id = 123;

    const dbConnection = {
      request: jest.fn(() => {
        return [{ id }];
      })
    };

    const gateway = W2Gateway({ dbConnection });
    const params = [{ id: 'id', type: 'Int', value: id }];
    const response = await gateway.getDocumentMetadata(id);

    expect(dbConnection.request).toHaveBeenCalledWith(
      getDocumentMetadataSQL,
      params
    );
    expect(response).not.toBeUndefined();
  });

  // it('returns undefined if error fetching document metadata', async function() {
  // const input = jest.fn();
  // const query = jest.fn(() => {
  //   throw new Error();
  // });
  // fakeSqlClient.request = jest.fn(() => {
  //   return {
  //     input,
  //     query
  //   };
  // });
  // const gateway = new UHTGateway();
  // const response = await gateway.fetchCustomer('invalid');
  // expect(response).toBeNull();
  // });
});
