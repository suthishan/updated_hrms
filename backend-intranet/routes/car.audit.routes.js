const express = require('express');
const router = express.Router();
const auditController = require('../controllers/car.audit.controller');
const upload = require('../config/multer.config');


/**
 * List All Upload Batches
 */
router.get('/batches',
  /*
      #swagger.path = '/api/audit/batches'
      #swagger.tags = ['Audit']
      #swagger.description = 'Get list of all uploaded Excel batches with sync summary'
  */
  auditController.listBatches
);


/**
 * Get Staging Rows by Batch
 */
router.get('/staging/:batchId',
  /*
      #swagger.path = '/api/audit/staging/{batchId}'
      #swagger.tags = ['Audit']
      #swagger.description = 'Preview all staging rows for a specific batch before sync'
  */
  auditController.getStagingRows
);


/**
 * Get Sync Status of a Batch
 */
router.get('/sync/status/:batchId',
  /*
      #swagger.path = '/api/audit/sync/status/{batchId}'
      #swagger.tags = ['Audit']
      #swagger.description = 'Check sync status and error details for a specific batch'
  */
  auditController.getSyncStatus
);


/**
 * Upload Excel to Staging Table
 */
router.post('/upload',
  /*
      #swagger.path = '/api/audit/upload'
      #swagger.tags = ['Audit']
      #swagger.description = 'Upload bulk Excel file into the staging table for review'
  */
  upload.single('file'),
  auditController.uploadExcel
);


/**
 * Sync Specific Batch to Master Table
 */
router.post('/sync/:batchId',
  /*
      #swagger.path = '/api/audit/sync/{batchId}'
      #swagger.tags = ['Audit']
      #swagger.description = 'Sync all pending rows of a specific batch to the main observations table'
  */
  auditController.syncToMaster
);


/**
 * Sync All Pending Rows to Master Table
 */
router.post('/sync',
  /*
      #swagger.path = '/api/audit/sync'
      #swagger.tags = ['Audit']
      #swagger.description = 'Sync all pending rows across all batches to the main observations table'
  */
  auditController.syncToMaster
);


/**
 * Retry Failed Rows for a Batch
 */
router.post('/sync/retry/:batchId',
  /*
      #swagger.path = '/api/audit/sync/retry/{batchId}'
      #swagger.tags = ['Audit']
      #swagger.description = 'Reset error rows to pending and retry sync for a specific batch'
  */
  auditController.retryErrors
);

/**
 * Get All Observations (with filters + pagination)
 */
router.post('/list',
  /*
      #swagger.path = '/api/observation/list'
      #swagger.tags = ['Observation']
      #swagger.description = 'Get all observations with optional filters: audit_year, status, risk_rating, division_id, audit_area_id. Supports limit/offset pagination.'
  */
  auditController.getAllObservations
);


/**
 * Get Single Observation
 */
router.post('/detail',
  /*
      #swagger.path = '/api/observation/detail'
      #swagger.tags = ['Observation']
      #swagger.description = 'Get full details of a single observation by observation_id'
  */
  auditController.getObservation
);


/**
 * Create New Observation
 */
router.post('/create',
  /*
      #swagger.path = '/api/observation/create'
      #swagger.tags = ['Observation']
      #swagger.description = 'Create a new audit observation manually. observation_number is auto-generated.'
  */
  auditController.createObservation
);


/**
 * Update Observation
 */
router.post('/update',
  /*
      #swagger.path = '/api/observation/update'
      #swagger.tags = ['Observation']
      #swagger.description = 'Update any editable fields of an existing observation by observation_id'
  */
  auditController.updateObservation
);


/**
 * Close Observation
 */
router.post('/close',
  /*
      #swagger.path = '/api/observation/close'
      #swagger.tags = ['Observation']
      #swagger.description = 'Mark an observation as Closed with closure_date and closure_remarks'
  */
  auditController.closeObservation
);


/**
 * Delete Observation
 */
router.post('/delete',
  /*
      #swagger.path = '/api/observation/delete'
      #swagger.tags = ['Observation']
      #swagger.description = 'Permanently delete an observation by observation_id'
  */
  auditController.deleteObservation
);




module.exports = router;