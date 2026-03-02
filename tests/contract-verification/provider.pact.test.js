const { Verifier } = require('@pact-foundation/pact');
const app = require('../../src/index'); // Import the actual provider app
const items = require('../../src/routes/items')._items;
const users = require('../../src/routes/users')._users;
const categories = require('../../src/routes/categories')._categories;

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
        'categories exist in the store': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 15 });
        },
        'category with ID 1 exists': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 15 });
        },
        'category with ID 1 exists and has items': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 15 });
        },
        'item with ID 1 exists': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
        },
        'items exist in the inventory': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
          items.push({ id: 2, name: 'Gadget', price: 19.99, category: 'Electronics', inStock: true });
          items.push({ id: 3, name: 'Thing', price: 5.49, category: 'Food', inStock: false });
          items.push({ id: 4, name: 'Doodad', price: 24.99, category: 'Clothing', inStock: true });
          items.push({ id: 5, name: 'Whatchamacallit', price: 12.99, category: 'Home Goods', inStock: true });
        },
        'items exist in the inventory for a specific category and in stock': () => {
          items.length = 0;
          items.push({ id: 2, name: 'Gadget', price: 19.99, category: 'Electronics', inStock: true });
        },
        'items exist matching the search query': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
        },
        'the categories API is available for creation': () => {
          categories.length = 0;
        },
        'the items API is available for creation': () => {
          items.length = 0;
        },
        'user with ID 1 exists': () => {
          users.length = 0;
          users.push({ id: 1, username: 'testuser', email: 'test@example.com', role: 'user' });
        },
        'user with ID 999 does not exist': () => {
          users.length = 0;
        },
      },
    };

    if (process.env.PACT_URL) {
      opts.pactUrls = [process.env.PACT_URL];
    } else {
      opts.pactBrokerUrl = process.env.PACT_BROKER_BASE_URL;
      opts.pactBrokerToken = process.env.PACT_BROKER_TOKEN;
      opts.consumerVersionSelectors = [
        { mainBranch: true },
        { deployedOrReleased: true },
      ];
    }

    return new Verifier(opts).verifyProvider();
  }, 60000);
});