const express = require('express');
const router = express.Router();

const users = [
  { id: 1, username: 'john_doe', email: 'john@example.com', role: 'admin' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user' },
  { id: 3, username: 'bob_wilson', email: 'bob@example.com', role: 'user' }
];

// GET /users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found', id });
  }
  
  // Don't expose sensitive data
  const { email, ...safeUser } = user;
  res.json(safeUser);
});

// GET /users/:id/profile - Get user profile (with email)
router.get('/:id/profile', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found', id });
  }
  
  res.json(user);
});

module.exports = router;
