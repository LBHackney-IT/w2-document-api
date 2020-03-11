const GetConvertedDocument = require('@lib/use-cases/GetConvertedDocument');
const fs = require('fs');
const Request = require('request');

const createTestItems = (id, docType, docString) => {
  return {
    doc: {
      id,
      doc: docString ? docString : 'doc string',
      mimeType: 'application/mt'
    },
    metadata: {
      id,
      type: docType,
      url: 'www.aws-signed-document-url.com/read/' + id
    }
  };
};

const dummyDocumentHandlers = (type, returnValue) => {
  return {
    [type]: jest.fn(() => {
      return returnValue;
    })
  };
};

describe('GetConvertedDocument', function() {
  const id = 1;
  const docType = 'foo';
  const { doc, metadata } = createTestItems(id, docType);

  let documentNotCached = true;
  let documentHandlers;
  let cacheGateway;
  let cacheGetSpy;
  let cachePutSpy;
  let cacheGetUrlspy;

  beforeEach(() => {
    jest.resetModules();
    cacheGateway = require('@lib/gateways/S3Gateway')({
      s3: {
        getObject: jest.fn(() => {
          if (documentNotCached == true) {
            const notFoundError = new Error();
            notFoundError.code = 'NoSuchKey';
            throw notFoundError;
          }
          return {
            promise: () => {
              return Promise.resolve({
                Body: doc.doc,
                Metadata: {
                  mimetype: doc.mimeType
                }
              });
            }
          };
        }),
        putObject: jest.fn(() => {
          return {
            promise: () => {
              return Promise.resolve;
            }
          };
        }),
        getSignedUrl: jest.fn(() => {
          return metadata.url;
        })
      }
    });

    cacheGetSpy = jest.spyOn(cacheGateway, 'get');
    cachePutSpy = jest.spyOn(cacheGateway, 'put');
    cacheGetUrlspy = jest.spyOn(cacheGateway, 'getUrl');
    documentHandlers = dummyDocumentHandlers(docType, doc);
  });

  it('selects the handler based on the doc type', async function() {
    documentNotCached = true;

    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    await usecase(metadata);

    expect(documentHandlers.foo).toHaveBeenCalled();
  });

  it('gets document from cache if it exists', async function() {
    documentNotCached = false;

    const usecase = GetConvertedDocument({
      cacheGateway,
      documentHandlers
    });

    await usecase(metadata);

    expect(cacheGetSpy).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).not.toHaveBeenCalled();
  });

  it('puts document in cache if it doesnt exist', async function() {
    documentNotCached = true;

    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    const returnedDocument = await usecase(metadata);

    expect(cacheGetSpy).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).toHaveBeenCalled();
    expect(cachePutSpy).toHaveBeenCalledWith(metadata.id, doc);
    expect(JSON.stringify(returnedDocument)).toBe(JSON.stringify(doc));
  });

  it('gets large document from cache if it exists and returns doc url', async function() {
    documentNotCached = false;
    doc.doc = fs.readFileSync('test/test-data/largeDocument');

    const usecase = GetConvertedDocument({
      cacheGateway,
      documentHandlers
    });

    const returnedDocument = await usecase(metadata);

    expect(cacheGetSpy).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).not.toHaveBeenCalled();
    expect(cacheGetUrlspy).toHaveBeenCalledWith(
      metadata.id,
      returnedDocument.mimeType,
      expect.anything()
    );
    expect(returnedDocument.url).toBe(metadata.url);
  });

  it('puts document in cache if it doesnt exist and returns doc url', async function() {
    documentNotCached = true;
    doc.doc = fs.readFileSync('test/test-data/largeDocument');

    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    const returnedDocument = await usecase(metadata);

    expect(cacheGetSpy).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).toHaveBeenCalled();
    expect(cachePutSpy).toHaveBeenCalledWith(metadata.id, doc);
    expect(cacheGetUrlspy).toHaveBeenCalledWith(
      metadata.id,
      returnedDocument.mimeType,
      expect.anything()
    );
    expect(returnedDocument.url).toBe(metadata.url);
  });
});
