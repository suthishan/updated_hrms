'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users } = require('../data/mockData');

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In mock mode, accept any password
  // In production: await bcrypt.compare(password, user.passwordHash)
  const validPassword = process.env.NODE_ENV === 'development'
    ? password === 'password123'
    : await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    id: user.id, name: user.name, email: user.email,
    role: user.role, division: user.division, department: user.department,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

/**
 * GET /api/auth/me
 */
router.get('/me', require('../middleware/auth').authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;
