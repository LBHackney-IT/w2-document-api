const request = require('supertest');

let app;

beforeEach(() => jest.resetModules()); // clear the cache

afterEach(() => app.close()); // teardown app after tests

describe('W2Gateway - uhw', () => {
  beforeEach(() => {
    process.env.URL_PREFIX = 'uhw';
    process.env.W2_DB_URL = 'mysql://sa:UHT-password@localhost/uhwlive';
    app = require('../../../api').app.listen();
  });

  it("can fetch a customer's documents from uhw", async () => {
    const response = await request(app).get('/customers/123456/documents');
    const documents = response.body;
    const expectedDocument = {
      date: '2010-02-03T20:30:14.000Z',
      format: null,
      text: 'ASB Interview Appointment - Complainant',
      title: 'Document',
      system: 'UHW',
      user: 'First.Last'
    };

    expect(response.status).toEqual(200);
    expect(documents.length).toEqual(1);
    expect(documents[0]).toMatchObject(expectedDocument);
  });
});

describe('W2Gateway - hncomino', () => {
  beforeEach(() => {
    process.env.URL_PREFIX = 'hncomino';
    process.env.W2_DB_URL = 'mysql://sa:UHT-password@localhost/cmData';
    app = require('../../../api').app.listen();
  });

  const cominoDocument = {
    date: '2010-02-03T20:30:14.000Z',
    format: null,
    title: 'Document',
    user: 'First.Last'
  };

  it("can fetch a customer's documents from hncomino (Academy Council Tax)", async () => {
    const response = await request(app).get('/customers/ct_ref_1/documents');

    const documents = response.body;

    const expectedDocument = {
      ...cominoDocument,
      text: 'I am a document from hncomino-ct'
    };

    expect(response.status).toEqual(200);
    expect(documents.length).toEqual(1);
    expect(documents[0]).toMatchObject(expectedDocument);
  });

  it("can fetch a customer's documents from hncomino (Academy Housing Benefit)", async () => {
    const response = await request(app).get('/customers/claim_ref_2/documents');

    const documents = response.body;

    const expectedDocument = {
      ...cominoDocument,
      text: 'I am a document from hncomino-hb'
    };

    expect(response.status).toEqual(200);
    expect(documents.length).toEqual(1);
    expect(documents[0]).toMatchObject(expectedDocument);
  });
});
