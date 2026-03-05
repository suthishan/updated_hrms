/**
 * Packaging Creative Approval — Express Routes
 * Mount point: /api/packaging  (registered in app.js)
 *
 * Public (no auth token required):
 *   GET  /approvers
 *
 * Protected (JWT via authenticate middleware required):
 *   POST /create-draft
 *   POST /upload-files
 *   POST /submit
 *   POST /get-requests
 *   POST /get-request-by-id
 *   POST /approve          — additionally requires APPROVER role
 *   GET  /audit-trail
 *   POST /dashboard-stats
 */
const express      = require('express');
const router       = express.Router();
const ctrl         = require('../controllers/packaging.controller');
const { authenticate, allowRoles } = require('../middleware/auth.middleware');
const upload       = require('../config/multer.config');

// Public — approver pool for SelectApprovers component (read-only)
router.get('/approvers', ctrl.getApprovers);

// All routes below require a valid JWT
router.use(authenticate);

router.post('/create-draft',       ctrl.createDraft);

// multipart — accept up to 10 files in the 'files' field
router.post('/upload-files',       upload.array('files', 10), ctrl.uploadFiles);

router.post('/submit',             ctrl.submitRequest);
router.post('/get-requests',       ctrl.getRequests);
router.post('/get-request-by-id',  ctrl.getRequestById);
router.post('/approve',            allowRoles('APPROVER'), ctrl.approve);
router.get('/audit-trail',         ctrl.getAuditTrail);
router.post('/dashboard-stats',    ctrl.getDashboardStats);

module.exports = router;
