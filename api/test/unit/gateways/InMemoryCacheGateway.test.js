describe('InMemoryCacheGateway', function() {
  let cacheGateway;

  beforeEach(() => {
    jest.resetModules();
    cacheGateway = require('@lib/gateways/InMemoryCacheGateway')();
  });

  it('can put a document in cache and then retrieve it', async function() {
    const id = 1;
    const doc = { id };

    await cacheGateway.put(id, doc);
    const docFromCache = await cacheGateway.get(id);

    expect(JSON.stringify(docFromCache)).toBe(JSON.stringify(doc));
  });
});
