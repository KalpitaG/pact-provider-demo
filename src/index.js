const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/items', itemsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({
    service: 'pact-provider-demo',
    version: '1.0.0',
    endpoints: ['/items', '/categories', '/users', '/health']
  });
});

const PORT = process.env.PORT || 3001;

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Provider service running on http://localhost:${PORT}`);
  });
}

module.exports = app;
