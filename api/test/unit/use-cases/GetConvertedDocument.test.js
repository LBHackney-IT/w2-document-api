const GetConvertedDocument = require('@lib/use-cases/GetConvertedDocument');
const fs = require('fs');

const createTestItems = (id, docType) => {
  return {
    doc: {
      id,
      doc: fs.readFileSync('test/test-data/largeDocument'),
      mimeType: 'application/mt'
    },
    metadata: { id, type: docType }
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

  let documentHandlers;
  let cacheGateway;
  let cacheGetSpy;
  let cachePutSpy;
  let cacheGetUrlspy;

  beforeEach(() => {
    jest.resetModules();
    cacheGateway = require('@lib/gateways/S3Gateway')({
      s3: {
        getObject: jest.fn(async () => {
          return promise: (() => {

          })
        }),
        putObject: jest.fn(),
        getSignedUrl: jest.fn()
      }
    });
    cacheGetSpy = jest.spyOn(cacheGateway, 'get');
    cachePutSpy = jest.spyOn(cacheGateway, 'put');
    cacheGetUrlspy = jest.fn();
    cacheGetUrlspy = jest.spyOn(cacheGateway, 'getUrl');
    documentHandlers = dummyDocumentHandlers(docType, doc);
  });

  it('selects the handler based on the doc type', async function() {
    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    await usecase(metadata);

    expect(documentHandlers.foo).toHaveBeenCalled();
  });

  it('gets document from cache if it exists', async function() {
    await cacheGateway.put(id, doc);
    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    const cachedDocument = await usecase(metadata);

    expect(cacheGetSpy).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).not.toHaveBeenCalled();
    expect(JSON.stringify(cachedDocument)).toBe(JSON.stringify(doc));
  });

  it('puts document in cache if it doesnt exist', async function() {
    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    const returnedDocument = await usecase(metadata);

    expect(cacheGetSpy).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).toHaveBeenCalled();
    expect(cachePutSpy).toHaveBeenCalledWith(metadata.id, doc);
    expect(JSON.stringify(returnedDocument)).toBe(JSON.stringify(doc));
  });
});
