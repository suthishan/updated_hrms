const express = require('express');
const router = express.Router();
const { auditTrail } = require('../data/store');

/**
 * GET /api/audit
 * Returns the full audit trail, with optional filters.
 */
router.get('/', (req, res) => {
  const { documentId, actionType, performedBy, from, to } = req.query;
  let result = [...auditTrail].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (documentId) result = result.filter(e => e.documentId === documentId);
  if (actionType) result = result.filter(e => e.actionType === actionType);
  if (performedBy) {
    const q = performedBy.toLowerCase();
    result = result.filter(e => e.performedBy.toLowerCase().includes(q) || e.performedByEmail.toLowerCase().includes(q));
  }
  if (from) result = result.filter(e => new Date(e.timestamp) >= new Date(from));
  if (to)   result = result.filter(e => new Date(e.timestamp) <= new Date(to));

  res.json({ totalData: result.length, data: result });
});

/**
 * GET /api/audit/document/:documentId
 * Returns the audit trail for a specific document.
 */
router.get('/document/:documentId', (req, res) => {
  const result = auditTrail
    .filter(e => e.documentId === req.params.documentId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  res.json({ totalData: result.length, data: result });
});

module.exports = router;
