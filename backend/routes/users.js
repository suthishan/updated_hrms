'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { users } = require('../data/mockData');

/**
 * GET /api/users
 * Returns user list (without password hashes).
 * Audit Team and HoD can see all; RP sees only themselves.
 */
router.get('/', authenticate, (req, res) => {
  let result = users.map(({ passwordHash: _, ...u }) => u);
  if (req.user.role === 'Responsible Person') {
    result = result.filter((u) => u.id === req.user.id);
  } else if (req.user.role === 'HoD') {
    result = result.filter((u) => u.division === req.user.division || u.role === 'Audit Team');
  }

  const { role, division } = req.query;
  if (role) result = result.filter((u) => u.role === role);
  if (division) result = result.filter((u) => u.division === division);

  res.json({ data: result, totalData: result.length });
});

/**
 * GET /api/users/:id
 */
router.get('/:id', authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (req.user.role === 'Responsible Person' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;
