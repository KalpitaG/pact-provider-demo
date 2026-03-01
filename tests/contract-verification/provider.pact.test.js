const { Verifier } = require('@pact-foundation/pact');
const app = require('../../src/index'); // Import the actual provider app

const itemsModule = require('../../src/routes/items');
const usersModule = require('../../src/routes/users');
const categoriesModule = require('../../src/routes/categories');

describe('Provider Verification', () => {
  let server;
  const PORT = 3002;

  beforeAll((done) => {
    server = app.listen(PORT, () => done());
  });

  afterAll((done) => {
    if (server) server.close(done);
    else done();
  });

  it('verifies pacts with consumers', async () => {
    const opts = {
      provider: 'pact-provider-demo',
      providerBaseUrl: `http://localhost:${PORT}`,
      publishVerificationResult: process.env.CI === 'true',
      providerVersion: process.env.GIT_COMMIT || process.env.GITHUB_SHA || '1.0.0-local',
      providerVersionBranch: process.env.GIT_BRANCH || 'main',
      logLevel: 'info',

      stateHandlers: {
        'categories exist': () => {
          const categories = categoriesModule._categories;
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 0 });
        },
        'category 1 exists': () => {
          const categories = categoriesModule._categories;
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 0 });
        },
        'category 1 exists with items': () => {
          const categories = categoriesModule._categories;
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 0 });
        },
        'category 999 does not exist': () => {
          const categories = categoriesModule._categories;
          categories.length = 0;
        },
        'item 1 exists': () => {
          const items = itemsModule._items;
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'item 1 exists and can be deleted': () => {
          const items = itemsModule._items;
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'item 1 exists and can be updated': () => {
          const items = itemsModule._items;
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'items exist in the inventory': () => {
          const items = itemsModule._items;
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
          items.push({ category: 'Books', id: 2, inStock: true, name: 'Book', price: 19.99 });
          items.push({ category: 'Clothing', id: 3, inStock: false, name: 'Shirt', price: 29.99 });
          items.push({ category: 'Electronics', id: 4, inStock: true, name: 'Gadget', price: 39.99 });
          items.push({ category: 'Food', id: 5, inStock: true, name: 'Apple', price: 0.99 });
        },
        'items exist in the inventory for category Electronics and are in stock': () => {
          const items = itemsModule._items;
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'items exist matching the search query': () => {
          const items = itemsModule._items;
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Super Widget', price: 12.99 });
        },
        'the categories API is available for creation': () => {
          const categories = categoriesModule._categories;
          categories.length = 0;
        },
        'the items API is available for creation': () => {
          const items = itemsModule._items;
          items.length = 0;
        },
        'user 1 exists': () => {
          const users = usersModule._users;
          users.length = 0;
          users.push({ id: 1, username: 'john.doe', email: 'john.doe@example.com', role: 'user' });
        },
        'user 1 exists with a profile': () => {
          const users = usersModule._users;
          users.length = 0;
          users.push({ id: 1, username: 'john.doe', email: 'john.doe@example.com', role: 'user' });
        },
        'user 999 does not exist': () => {
          const users = usersModule._users;
          users.length = 0;
        },
        'user 999 does not exist with a profile': () => {
          const users = usersModule._users;
          users.length = 0;
        },
      },
    };

    // CRITICAL: PACT_URL vs broker source
    if (process.env.PACT_URL) {
      opts.pactUrls = [process.env.PACT_URL];
    } else {
      opts.pactBrokerUrl = process.env.PACTFLOW_BASE_URL || process.env.PACT_BROKER_BASE_URL;
      opts.pactBrokerToken = process.env.PACTFLOW_TOKEN || process.env.PACT_BROKER_TOKEN;
      opts.consumerVersionSelectors = [
        { mainBranch: true },
        { deployedOrReleased: true },
      ];
    }

    return new Verifier(opts).verifyProvider();
  }, 60000);
});