const { Verifier } = require('@pact-foundation/pact');
const app = require('../../src/index'); // Import the actual provider app

// Import data arrays from route files
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
        // Sets up a single category with id 1
        'categories exist': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 0 });
        },
        // Sets up a single category with id 1
        'category 1 exists': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 0 });
        },
        // Sets up a single category with id 1
        'category 1 exists with items': () => {
          categories.length = 0;
          categories.push({ id: 1, name: 'Electronics', slug: 'electronics', itemCount: 0 });
        },
        // Clears all categories
        'category 999 does not exist': () => {
          categories.length = 0;
        },
        // Sets up a single item with id 1
        'item 1 exists': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
        },
        // Sets up a single item with id 1
        'item 1 exists and can be deleted': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
        },
        // Sets up a single item with id 1
        'item 1 exists and can be updated': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
        },
        // Sets up multiple items in the inventory
        'items exist in the inventory': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
          items.push({ id: 2, name: 'Item Two', price: 24.99, category: 'clothing', inStock: true });
          items.push({ id: 3, name: 'Item Three', price: 5.49, category: 'food', inStock: false });
          items.push({ id: 4, name: 'Item Four', price: 15.00, category: 'electronics', inStock: true });
          items.push({ id: 5, name: 'Item Five', price: 30.00, category: 'clothing', inStock: false });
        },
        // Sets up a single item in the inventory for category Electronics and is in stock
        'items exist in the inventory for category Electronics and are in stock': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Widget', price: 9.99, category: 'Electronics', inStock: true });
        },
        // Sets up a single item matching the search query
        'items exist matching the search query': () => {
          items.length = 0;
          items.push({ id: 1, name: 'Super Widget', price: 12.99, category: 'Electronics', inStock: true });
        },
        // Clears categories for creation
        'the categories API is available for creation': () => {
          categories.length = 0;
        },
        // Clears items for creation
        'the items API is available for creation': () => {
          items.length = 0;
        },
        // Sets up a single user with id 1
        'user 1 exists': () => {
          users.length = 0;
          users.push({ id: 1, username: 'john.doe', email: 'john.doe@example.com', role: 'user' });
        },
        // Sets up a single user with id 1 and a profile
        'user 1 exists with a profile': () => {
          users.length = 0;
          users.push({ id: 1, username: 'john.doe', email: 'john.doe@example.com', role: 'user' });
        },
        // Clears all users
        'user 999 does not exist': () => {
          users.length = 0;
        },
        // Clears all users
        'user 999 does not exist with a profile': () => {
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