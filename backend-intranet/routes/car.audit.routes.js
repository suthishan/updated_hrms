const express = require('express');
const router = express.Router();
const auditController = require('../controllers/car.audit.controller');
const upload = require('../config/multer.config');
const uploadAudit = require('../config/multer-audit.config');


/* ─────────────────────────────────────────────────────────────────────────────
   Excel Upload / Staging / Sync
───────────────────────────────────────────────────────────────────────────── */

router.get('/batches', auditController.listBatches);

router.get('/staging/:batchId', auditController.getStagingRows);

router.get('/sync/status/:batchId', auditController.getSyncStatus);

router.post('/upload', upload.single('file'), auditController.uploadExcel);

router.post('/sync/:batchId', auditController.syncToMaster);

router.post('/sync', auditController.syncToMaster);

router.post('/sync/retry/:batchId', auditController.retryErrors);


/* ─────────────────────────────────────────────────────────────────────────────
   Observations CRUD
───────────────────────────────────────────────────────────────────────────── */

/** GET  /api/audit/list  — list with filters + pagination */
router.post('/list', auditController.getAllObservations);

/** POST /api/audit/detail — get single observation */
router.post('/detail', auditController.getObservation);

/** POST /api/audit/create — create new observation */
router.post('/create', auditController.createObservation);

/** POST /api/audit/update — update observation fields */
router.post('/update', auditController.updateObservation);

/** POST /api/audit/close  — final auditor close */
router.post('/close', auditController.closeObservation);

/** POST /api/audit/delete — delete observation */
router.post('/delete', auditController.deleteObservation);


/* ─────────────────────────────────────────────────────────────────────────────
   Annexures (observation-level attachments)
───────────────────────────────────────────────────────────────────────────── */

/**
 * POST /api/audit/annexures/upload
 * Body (multipart): observation_id, uploaded_by (optional)
 * Files field name: "files"  (up to 20 files, all formats, 50 MB each)
 */
router.post(
  '/annexures/upload',
  uploadAudit.array('files', 20),
  auditController.uploadAnnexures
);

/**
 * GET /api/audit/annexures/:observationId
 * Returns array of annexure metadata for the observation
 */
router.get('/annexures/:observationId', auditController.listAnnexures);

/**
 * GET /api/audit/annexures/download/:annexureId
 * Streams the file as an attachment download
 * NOTE: must be declared BEFORE the :observationId route so Express
 *       doesn't accidentally match "download" as an observationId.
 */
router.get('/annexures/download/:annexureId', auditController.downloadAnnexure);

/**
 * DELETE /api/audit/annexures/:annexureId
 * Removes DB record + physical file
 */
router.delete('/annexures/:annexureId', auditController.deleteAnnexure);


/* ─────────────────────────────────────────────────────────────────────────────
   Follow-ups (responsible-person activity trail)
───────────────────────────────────────────────────────────────────────────── */

/**
 * POST /api/audit/followups/add
 * Body (multipart): observation_id, responsible_person_id, remarks,
 *                   updated_target_date (optional), action_type
 * Files field name: "files"  (optional evidence, up to 20 files)
 */
router.post(
  '/followups/add',
  uploadAudit.array('files', 20),
  auditController.addFollowup
);

/**
 * GET /api/audit/followups/:observationId
 * Returns ordered follow-up trail with evidence file metadata
 */
router.get('/followups/:observationId', auditController.listFollowups);

/**
 * POST /api/audit/followups/request-closure
 * Responsible person submits a closure request.
 * Body (multipart): observation_id, responsible_person_id, remarks
 * Files field name: "files"  (optional closure evidence)
 * Sets observation status → 'Request Closure'
 */
router.post(
  '/followups/request-closure',
  uploadAudit.array('files', 20),
  auditController.requestClosure
);


/* ─────────────────────────────────────────────────────────────────────────────
   Auditor Approval
───────────────────────────────────────────────────────────────────────────── */

/**
 * POST /api/audit/approve-close
 * Auditor approves a 'Request Closure' observation → status becomes 'Closed'
 * Body (JSON): { observation_id, auditor_user_id, closure_date, closure_remarks }
 */
router.post('/approve-close', auditController.approveClose);


/* ─────────────────────────────────────────────────────────────────────────────
   Evidence file download
───────────────────────────────────────────────────────────────────────────── */

/**
 * GET /api/audit/evidence/download/:fileId
 * Streams an evidence file attached to a follow-up entry
 */
router.get('/evidence/download/:fileId', auditController.downloadEvidence);


module.exports = router;
