const GetConvertedDocument = require('../../../lib/use-cases/GetConvertedDocument');

const dummyCacheGateway = getValue => {
  return {
    get: jest.fn(() => {
      return getValue;
    }),
    put: jest.fn()
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
  const docType = 'External';
  const dummyDoc = { doc: 'doc', mimeType: 'application/mt' };
  const metadata = { id: 1, type: docType };

  it('selects the handler based on the doc type', async function() {
    const cacheGateway = dummyCacheGateway(null);
    const documentHandlers = dummyDocumentHandlers('foo', dummyDoc);
    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    await usecase({ id: 1, type: 'foo' });

    expect(documentHandlers.foo).toHaveBeenCalled();
  });

  it('gets document from cache if it exists', async function() {
    const cacheGateway = dummyCacheGateway(dummyDoc);
    const documentHandlers = dummyDocumentHandlers(docType);
    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    const cachedDocument = await usecase(metadata);

    expect(cacheGateway.get).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).not.toHaveBeenCalled();
    expect(cachedDocument).toBe(dummyDoc);
  });

  it('puts document in cache if it doesnt exist', async function() {
    const cacheGateway = dummyCacheGateway(null);
    const documentHandlers = dummyDocumentHandlers(docType, dummyDoc);
    const usecase = GetConvertedDocument({ cacheGateway, documentHandlers });

    const returnedDocument = await usecase(metadata);

    expect(cacheGateway.get).toHaveBeenCalledWith(metadata.id);
    expect(documentHandlers[docType]).toHaveBeenCalled();
    expect(cacheGateway.put).toHaveBeenCalledWith(metadata.id, dummyDoc);
    expect(returnedDocument).toBe(dummyDoc);
  });
});
