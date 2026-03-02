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
          // Note: categoryItems is NOT exported, so we can't directly modify it.
          // The test expects a Laptop with id 1 and price 1200 to be returned
          // Since we cannot directly modify categoryItems, we will have to rely on the default data
          // or create a new endpoint to manage categoryItems via the API
          // For now, we will just ensure the category exists.
        },
        'item with ID 1 exists': () => {
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
        },
        'items exist in the inventory': () => {
          items.length = 0;
          items.push({ category: 'Electronics', id: 1, inStock: true, name: 'Widget', price: 9.99 });
          items.push({ category: 'Electronics', id: 2, inStock: true, name: 'Gadget', price: 19.99 });
          items.push({ category: 'Books', id: 3, inStock: false, name: 'Book', price: 5.99 });
          items.push({ category: 'Clothing', id: 4, inStock: true, name: 'Shirt', price: 29.99 });
          items.push({ category: 'Food', id: 5, inStock: false, name: 'Apple', price: 0.99 });
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
          // No setup needed, API is always available
          categories.length = 0; // Clear existing categories
        },
        'the items API is available for creation': () => {
          // No setup needed, API is always available
          items.length = 0; // Clear existing items
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