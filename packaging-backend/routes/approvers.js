const express = require('express');
const router = express.Router();
const { APPROVERS } = require('../data/store');

/**
 * GET /api/approvers
 * Returns the master list of all approvers.
 */
router.get('/', (req, res) => {
  const { search, location, active } = req.query;
  let result = [...APPROVERS];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q)
    );
  }
  if (location) result = result.filter(a => a.location === location);
  if (active !== undefined) result = result.filter(a => a.isActive === (active === 'true'));

  res.json({ totalData: result.length, data: result });
});

/**
 * GET /api/approvers/:id
 */
router.get('/:id', (req, res) => {
  const approver = APPROVERS.find(a => a.id === req.params.id);
  if (!approver) return res.status(404).json({ message: 'Approver not found.' });
  res.json(approver);
});

module.exports = router;
