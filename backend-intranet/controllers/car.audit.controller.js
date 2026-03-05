const XLSX = require('xlsx');
const crypto = require('crypto');
const AuditModel = require('../models/car.audit.model');
const fs = require('fs');
// ─── HELPERS ──────────────────────────────────────────────────────────────────

const COLUMN_MAP = {
  'Audit Year': 'audit_year',
  'Audit Area': 'audit_area',
  'Division': 'division',
  'Observation': 'observation_title',
  'Risk Ratings': 'risk_rating',
  'Details of the findings': 'details_of_findings',
  'Follow-up Commitment from Management': 'followup_commitment',
  'Responsible Personnel': 'responsible_person',
  'Initial Target Date': 'initial_target_date',
  'Subsequent Follow Up 1': 'subsequent_followup_1',
  'Updated Target Date 1': 'updated_target_date_1',
  'Status': 'status',
};

const VALID_RATINGS = ['High', 'Medium', 'Low', 'Improvement'];
const VALID_STATUSES = ['Open', 'Repeated', 'Closed', 'Overdue'];

function generateBatchId() {
  const id = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  return `BATCH-${Date.now()}-${id.substring(0, 8).toUpperCase()}`;
}

function parseExcelDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  const parsed = new Date(val);
  return !isNaN(parsed.getTime()) ? parsed.toISOString().split('T')[0] : String(val);
}

function validateRow(row, rowIndex) {
  const errors = [];
  if (!row.audit_year || isNaN(parseInt(row.audit_year)))
    errors.push(`Row ${rowIndex}: Audit Year is required and must be a number`);
  if (!row.observation_title?.trim())
    errors.push(`Row ${rowIndex}: Observation (title) is required`);
  if (!VALID_RATINGS.includes(row.risk_rating))
    errors.push(`Row ${rowIndex}: Risk Rating must be one of: ${VALID_RATINGS.join(', ')}`);
  if (!row.details_of_findings?.trim())
    errors.push(`Row ${rowIndex}: Details of findings is required`);
  if (!row.followup_commitment?.trim())
    errors.push(`Row ${rowIndex}: Follow-up Commitment is required`);
  if (!row.responsible_person?.trim())
    errors.push(`Row ${rowIndex}: Responsible Personnel is required`);
  if (!row.initial_target_date?.trim())
    errors.push(`Row ${rowIndex}: Initial Target Date is required`);
  if (row.status && !VALID_STATUSES.includes(row.status))
    errors.push(`Row ${rowIndex}: Status must be one of: ${VALID_STATUSES.join(', ')}`);
  return errors;
}

// ─── UPLOAD CONTROLLER ────────────────────────────────────────────────────────

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ sts: '0', message: 'No file uploaded' });
    }

    // ✅ diskStorage saves to disk — read from req.file.path using fs
    const fileBuffer = fs.readFileSync(req.file.path);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      blankrows: false
    });

    // ✅ Delete temp file from disk after reading — cleanup
    fs.unlinkSync(req.file.path);

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({ sts: '0', message: 'Excel file is empty or has no data rows' });
    }

    // Map Excel columns to internal fields
    const mappedRows = rawRows.map((raw) => {
      const mapped = {};
      for (const [excelCol, fieldName] of Object.entries(COLUMN_MAP)) {
        let val = raw[excelCol] ?? '';
        if (['initial_target_date', 'updated_target_date_1'].includes(fieldName)) {
          val = parseExcelDate(val);
        } else {
          val = val !== null && val !== undefined ? String(val).trim() : '';
        }
        mapped[fieldName] = val;
      }
      return mapped;
    });

    // Collect validation warnings (don't block — let sync fail individual rows)
    const allErrors = [];
    mappedRows.forEach((row, i) => allErrors.push(...validateRow(row, i + 2)));

    const batchId = generateBatchId();
    const uploadedByUserId = req.body.uploaded_by_user_id || req.headers['x-user-id'] || 768;

    console.info(`Uploading batch ${batchId} with ${mappedRows.length} rows by user ${uploadedByUserId}`);

    const insertedRows = await AuditModel.insertBatch(
      mappedRows, batchId, req.file.originalname, uploadedByUserId
    );

    return res.status(201).json({
      sts: '1',
      message: `${insertedRows.length} rows uploaded to staging`,
      result: {
        batch_id: batchId,
        total_rows: insertedRows.length,
        validation_warnings: allErrors.length > 0 ? allErrors : undefined,
        next_step: `Call POST /api/audit/sync/${batchId} to sync to main table`
      }
    });

  } catch (error) {
    // Cleanup temp file if something went wrong mid-process
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Upload failed' });
  }
};

exports.getStagingRows = async (req, res) => {
  try {
    const { batchId } = req.params;
    const [rows, summary] = await Promise.all([
      AuditModel.getByBatch(batchId),
      AuditModel.getBatchSummary(batchId)
    ]);
    return res.json({ sts: '1', message: 'Staging rows fetched successfully', result: { batch_id: batchId, summary, rows } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to fetch staging rows' });
  }
};

exports.listBatches = async (req, res) => {
  try {
    const result = await AuditModel.listBatches();
    return res.json({ sts: '1', message: 'Batch list fetched successfully', result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to fetch batches' });
  }
};

// ─── SYNC CONTROLLER ──────────────────────────────────────────────────────────

exports.syncToMaster = async (req, res) => {
  try {
    const batchId = req.params.batchId || null;
    const pendingRows = await AuditModel.getPendingRows(batchId);
    console.info(`Syncing batch ${batchId || 'ALL'} - ${pendingRows.length} pending rows found`);
    if (pendingRows.length === 0) {
      return res.json({
        sts: '1',
        message: batchId ? `No pending rows found for batch: ${batchId}` : 'No pending rows to sync',
        result: { synced: 0, errors: 0 }
      });
    }

    let synced = 0;
    let errors = 0;
    const errorDetails = [];

    for (const row of pendingRows) {
      try {
        const audit_area_id = row.audit_area
          ? await AuditModel.findAuditAreaByName(row.audit_area) : null;

        const division_id = row.division
          ? await AuditModel.findDivisionByName(row.division) : null;

        const responsible_person_id = row.responsible_person
          ? await AuditModel.findEmployeeByNameOrCode(row.responsible_person) : null;

        if (!responsible_person_id)
          throw new Error(`Employee not found: "${row.responsible_person}"`);

        if (!VALID_RATINGS.includes(row.risk_rating))
          throw new Error(`Invalid risk rating: "${row.risk_rating}"`);
        console.info(`uploaded_by_user_id ${row.uploaded_by_user_id} - Audit Area: ${row.audit_area} (${audit_area_id}), Division: ${row.division} (${division_id}), Responsible: ${row.responsible_person} (${responsible_person_id})`);
        const inserted = await AuditModel.insertObservation({
          audit_year: parseInt(row.audit_year),
          audit_area_id,
          division_id,
          observation_title: row.observation_title,
          risk_rating: row.risk_rating,
          details_of_findings: row.details_of_findings,
          followup_commitment: row.followup_commitment,
          responsible_person_id,
          initial_target_date: row.initial_target_date || null,
          subsequent_followup_1: row.subsequent_followup_1 || null,
          updated_target_date_1: row.updated_target_date_1 || null,
          status: row.status || 'Open',
          created_by_user_id: row.uploaded_by_user_id || 1
        });

        await AuditModel.markSynced(row.staging_id, inserted.observation_id);
        synced++;

      } catch (rowErr) {
        await AuditModel.markError(row.staging_id, rowErr.message);
        errorDetails.push({ staging_id: row.staging_id, error: rowErr.message });
        errors++;
      }
    }

    return res.json({
      sts: '1',
      message: `Sync complete: ${synced} synced, ${errors} failed`,
      result: {
        total_processed: pendingRows.length,
        synced,
        errors,
        error_details: errorDetails.length > 0 ? errorDetails : undefined
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Sync failed' });
  }
};

exports.getSyncStatus = async (req, res) => {
  try {
    const { batchId } = req.params;
    const [summary, rows] = await Promise.all([
      AuditModel.getBatchSummary(batchId),
      AuditModel.getByBatch(batchId)
    ]);
    const error_rows = rows
      .filter(r => r.sync_status === 'Error')
      .map(r => ({ staging_id: r.staging_id, observation_title: r.observation_title, error: r.sync_error }));

    return res.json({
      sts: '1',
      message: 'Sync status fetched successfully',
      result: { batch_id: batchId, summary, error_rows: error_rows.length > 0 ? error_rows : undefined }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to fetch sync status' });
  }
};

exports.retryErrors = async (req, res) => {
  try {
    const { batchId } = req.params;
    await AuditModel.resetErrorRows(batchId);
    // Re-run sync on reset rows
    req.params.batchId = batchId;
    return exports.syncToMaster(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Retry failed' });
  }
};

// ─── GET ALL OBSERVATIONS ─────────────────────────────────────────────────────

exports.getAllObservations = async (req, res) => {
  try {
    const {
      audit_year, status, risk_rating,
      division_id, audit_area_id,
      limit, offset
    } = req.body;

    const { rows, total } = await AuditModel.getAllObservations({
      audit_year, status, risk_rating,
      division_id, audit_area_id,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    });

    return res.json({
      sts: '1',
      message: 'Observations fetched successfully',
      total,
      result: rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to fetch observations' });
  }
};

// ─── GET SINGLE OBSERVATION ───────────────────────────────────────────────────

exports.getObservation = async (req, res) => {
  try {
    const { observation_id } = req.body;

    if (!observation_id) {
      return res.status(400).json({ sts: '0', message: 'observation_id is required' });
    }

    const result = await AuditModel.getObservationById(observation_id);

    if (!result) {
      return res.status(404).json({ sts: '0', message: 'Observation not found' });
    }

    return res.json({
      sts: '1',
      message: 'Observation fetched successfully',
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to fetch observation' });
  }
};

// ─── CREATE OBSERVATION ───────────────────────────────────────────────────────

exports.createObservation = async (req, res) => {
  try {
    const {
      audit_year, audit_area_id, division_id, observation_title,
      risk_rating, details_of_findings, followup_commitment,
      responsible_person_id, initial_target_date, subsequent_followup_1,
      updated_target_date_1, status
    } = req.body;

    // Required field validation
    if (!audit_year || !observation_title || !risk_rating ||
        !details_of_findings || !followup_commitment ||
        !responsible_person_id || !initial_target_date) {
      return res.status(400).json({
        sts: '0',
        message: 'audit_year, observation_title, risk_rating, details_of_findings, followup_commitment, responsible_person_id and initial_target_date are required'
      });
    }

    if (!VALID_RATINGS.includes(risk_rating)) {
      return res.status(400).json({
        sts: '0',
        message: `risk_rating must be one of: ${VALID_RATINGS.join(', ')}`
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        sts: '0',
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const result = await AuditModel.createObservation({
      audit_year, audit_area_id, division_id, observation_title,
      risk_rating, details_of_findings, followup_commitment,
      responsible_person_id, initial_target_date, subsequent_followup_1,
      updated_target_date_1, status,
      created_by_user_id: req.body.created_by_user_id || req.headers['x-user-id'] || 1
    });

    return res.status(201).json({
      sts: '1',
      message: 'Observation created successfully',
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to create observation' });
  }
};

// ─── UPDATE OBSERVATION ───────────────────────────────────────────────────────

exports.updateObservation = async (req, res) => {
  try {
    const { observation_id, ...fields } = req.body;

    if (!observation_id) {
      return res.status(400).json({ sts: '0', message: 'observation_id is required' });
    }

    if (fields.risk_rating && !VALID_RATINGS.includes(fields.risk_rating)) {
      return res.status(400).json({
        sts: '0',
        message: `risk_rating must be one of: ${VALID_RATINGS.join(', ')}`
      });
    }

    if (fields.status && !VALID_STATUSES.includes(fields.status)) {
      return res.status(400).json({
        sts: '0',
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) {
      return res.status(404).json({ sts: '0', message: 'Observation not found' });
    }

    const result = await AuditModel.updateObservation(observation_id, fields);

    return res.json({
      sts: '1',
      message: 'Observation updated successfully',
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to update observation' });
  }
};

// ─── CLOSE OBSERVATION ────────────────────────────────────────────────────────

exports.closeObservation = async (req, res) => {
  try {
    const { observation_id, closure_date, closure_remarks } = req.body;

    if (!observation_id) {
      return res.status(400).json({ sts: '0', message: 'observation_id is required' });
    }

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) {
      return res.status(404).json({ sts: '0', message: 'Observation not found' });
    }

    if (existing.status === 'Closed') {
      return res.status(400).json({ sts: '0', message: 'Observation is already closed' });
    }

    const result = await AuditModel.closeObservation(observation_id, {
      closure_date,
      closure_remarks,
      closed_by_user_id: req.body.closed_by_user_id || req.headers['x-user-id'] || 1
    });

    return res.json({
      sts: '1',
      message: 'Observation closed successfully',
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to close observation' });
  }
};

// ─── DELETE OBSERVATION ───────────────────────────────────────────────────────

exports.deleteObservation = async (req, res) => {
  try {
    const { observation_id } = req.body;

    if (!observation_id) {
      return res.status(400).json({ sts: '0', message: 'observation_id is required' });
    }

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) {
      return res.status(404).json({ sts: '0', message: 'Observation not found' });
    }

    await AuditModel.deleteObservation(observation_id);

    return res.json({
      sts: '1',
      message: 'Observation deleted successfully',
      result: { observation_id }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Failed to delete observation' });
  }
};






