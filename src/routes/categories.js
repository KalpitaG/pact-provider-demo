const express = require('express');
const router = express.Router();

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', itemCount: 15 },
  { id: 2, name: 'Clothing', slug: 'clothing', itemCount: 42 },
  { id: 3, name: 'Food', slug: 'food', itemCount: 28 }
];

const categoryItems = {
  1: [
    { id: 101, name: 'Laptop', price: 999.99 },
    { id: 102, name: 'Phone', price: 699.99 }
  ],
  2: [
    { id: 201, name: 'T-Shirt', price: 19.99 },
    { id: 202, name: 'Jeans', price: 49.99 }
  ],
  3: [
    { id: 301, name: 'Apple', price: 0.99 },
    { id: 302, name: 'Bread', price: 2.49 }
  ]
};

// GET /categories - List all categories
router.get('/', (req, res) => {
  res.json({ categories, total: categories.length });
});

// GET /categories/:id - Get single category
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found', id });
  }
  
  res.json(category);
});

// GET /categories/:id/items - Get items in category
router.get('/:id/items', (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found', id });
  }
  
  const items = categoryItems[id] || [];
  res.json({ category: category.name, items, count: items.length });
});

// POST /categories - Create category
router.post('/', (req, res) => {
  const { name, slug } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newCategory = {
    id: categories.length + 1,
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    itemCount: 0
  };
  
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

module.exports = router;
