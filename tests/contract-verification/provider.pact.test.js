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
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics' });
        },
        'category with ID 1 exists': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics' });
        },
        'category with ID 1 exists and has items': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics' });

          // No direct access to categoryItems, so we can't set it up directly.
          // The test case expects categoryItems[1] to have an item with id 1.
          // Since we can't directly manipulate categoryItems, we'll rely on the
          // existing data structure in the provider code.
          // If the test fails because of missing items, consider adding an API
          // to manipulate categoryItems or seed the data in a different way.
        },
        'item with ID 1 exists': () => {
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'items exist in the inventory': () => {
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'items exist in the inventory for a specific category and in stock': () => {
          items.length = 0;
          items.push({ category: 'Electronics', id: 2, inStock: true, name: 'Gadget', price: 19.99 });
        },
        'items exist matching the search query': () => {
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'the categories API is available for creation': () => {
          categories.length = 0;
        },
        'the items API is available for creation': () => {
          items.length = 0;
        },
        'user with ID 1 exists': () => {
          users.length = 0;
          users.push({ email: 'test@example.com', id: 1, role: 'user', username: 'testuser' });
        },
        'user with ID 999 does not exist': () => {
          users.length = 0;
        },
      },
    };

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