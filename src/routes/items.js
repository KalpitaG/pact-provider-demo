const express = require('express');
const router = express.Router();

// In-memory data store (simulates database)
const items = [
  { id: 1, name: 'Item One', price: 10.99, category: 'electronics', inStock: true },
  { id: 2, name: 'Item Two', price: 24.99, category: 'clothing', inStock: true },
  { id: 3, name: 'Item Three', price: 5.49, category: 'food', inStock: false }
];

// GET /items - List all items
router.get('/', (req, res) => {
  const { category, inStock } = req.query;
  let result = [...items];
  
  if (category) {
    result = result.filter(item => item.category === category);
  }
  if (inStock !== undefined) {
    result = result.filter(item => item.inStock === (inStock === 'true'));
  }
  
  res.json({ items: result, total: result.length });
});

// GET /items/search - Search items
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query "q" is required' });
  }
  
  const results = items.filter(item => 
    item.name.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({ results, query: q, count: results.length });
});

// GET /items/:id - Get single item
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found', id });
  }
  
  res.json(item);
});

// POST /items - Create item
router.post('/', (req, res) => {
  const { name, price, category, inStock } = req.body;
  
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  const newItem = {
    id: items.length + 1,
    name,
    price,
    category: category || 'uncategorized',
    inStock: inStock !== undefined ? inStock : true
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id - Replace item
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found', id });
  }
  
  const { name, price, category, inStock } = req.body;
  
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  items[index] = { id, name, price, category, inStock };
  res.json(items[index]);
});

// PATCH /items/:id - Update item
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found', id });
  }
  
  Object.assign(item, req.body);
  res.json(item);
});

// DELETE /items/:id - Delete item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found', id });
  }
  
  items.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
module.exports._items = items;