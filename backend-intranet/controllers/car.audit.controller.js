'use strict';
const XLSX = require('xlsx');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const AuditModel = require('../models/car.audit.model');

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

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

const VALID_RATINGS  = ['High', 'Medium', 'Low', 'Improvement'];
const VALID_STATUSES = ['Open', 'Repeated', 'Closed', 'Overdue', 'Request Closure'];

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
    errors.push(`Row ${rowIndex}: Audit Year is required`);
  if (!row.observation_title?.trim())
    errors.push(`Row ${rowIndex}: Observation title is required`);
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

// ─── EXCEL UPLOAD ─────────────────────────────────────────────────────────────

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ sts: '0', message: 'No file uploaded' });

    const fileBuffer = fs.readFileSync(req.file.path);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', blankrows: false });

    fs.unlinkSync(req.file.path);

    if (!rawRows || rawRows.length === 0)
      return res.status(400).json({ sts: '0', message: 'Excel file is empty or has no data rows' });

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

    const allErrors = [];
    mappedRows.forEach((row, i) => allErrors.push(...validateRow(row, i + 2)));

    const batchId = generateBatchId();
    const uploadedByUserId = req.body.uploaded_by_user_id || req.headers['x-user-id'] || 768;

    const insertedRows = await AuditModel.insertBatch(
      mappedRows, batchId, req.file.originalname, uploadedByUserId
    );

    return res.status(201).json({
      sts: '1',
      message: `${insertedRows.length} rows uploaded to staging`,
      result: {
        batch_id: batchId,
        total_rows: insertedRows.length,
        validation_warnings: allErrors.length ? allErrors : undefined,
      },
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message || 'Upload failed' });
  }
};

exports.getStagingRows = async (req, res) => {
  try {
    const { batchId } = req.params;
    const [rows, summary] = await Promise.all([
      AuditModel.getByBatch(batchId),
      AuditModel.getBatchSummary(batchId),
    ]);
    return res.json({ sts: '1', message: 'OK', result: { batch_id: batchId, summary, rows } });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.listBatches = async (req, res) => {
  try {
    const result = await AuditModel.listBatches();
    return res.json({ sts: '1', message: 'OK', result });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.syncToMaster = async (req, res) => {
  try {
    const batchId = req.params.batchId || null;
    const pendingRows = await AuditModel.getPendingRows(batchId);

    if (!pendingRows.length)
      return res.json({ sts: '1', message: 'No pending rows', result: { synced: 0, errors: 0 } });

    let synced = 0;
    let errors = 0;
    const errorDetails = [];

    for (const row of pendingRows) {
      try {
        const audit_area_id = row.audit_area ? await AuditModel.findAuditAreaByName(row.audit_area) : null;
        const division_id   = row.division   ? await AuditModel.findDivisionByName(row.division)   : null;
        const responsible_person_id = row.responsible_person
          ? await AuditModel.findEmployeeByNameOrCode(row.responsible_person)
          : null;

        if (!responsible_person_id) throw new Error(`Employee not found: "${row.responsible_person}"`);
        if (!VALID_RATINGS.includes(row.risk_rating)) throw new Error(`Invalid risk rating: "${row.risk_rating}"`);

        const inserted = await AuditModel.createObservation({
          audit_year: parseInt(row.audit_year),
          audit_area_id, division_id,
          observation_title: row.observation_title,
          risk_rating: row.risk_rating,
          details_of_findings: row.details_of_findings,
          followup_commitment: row.followup_commitment,
          responsible_person_id,
          initial_target_date: row.initial_target_date || null,
          subsequent_followup_1: row.subsequent_followup_1 || null,
          updated_target_date_1: row.updated_target_date_1 || null,
          status: row.status || 'Open',
          created_by_user_id: row.uploaded_by_user_id || 1,
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
      result: { total_processed: pendingRows.length, synced, errors, error_details: errorDetails.length ? errorDetails : undefined },
    });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.getSyncStatus = async (req, res) => {
  try {
    const { batchId } = req.params;
    const [summary, rows] = await Promise.all([
      AuditModel.getBatchSummary(batchId),
      AuditModel.getByBatch(batchId),
    ]);
    const error_rows = rows
      .filter((r) => r.sync_status === 'Error')
      .map((r) => ({ staging_id: r.staging_id, observation_title: r.observation_title, error: r.sync_error }));

    return res.json({
      sts: '1', message: 'OK',
      result: { batch_id: batchId, summary, error_rows: error_rows.length ? error_rows : undefined },
    });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.retryErrors = async (req, res) => {
  try {
    await AuditModel.resetErrorRows(req.params.batchId);
    return exports.syncToMaster(req, res);
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

// ─── OBSERVATIONS CRUD ────────────────────────────────────────────────────────

exports.getAllObservations = async (req, res) => {
  try {
    const { audit_year, status, risk_rating, division_id, audit_area_id, limit, offset } = req.body;
    const { rows, total } = await AuditModel.getAllObservations({
      audit_year, status, risk_rating, division_id, audit_area_id,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
    });
    return res.json({ sts: '1', message: 'OK', total, result: rows });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.getObservation = async (req, res) => {
  try {
    const { observation_id } = req.body;
    if (!observation_id) return res.status(400).json({ sts: '0', message: 'observation_id required' });
    const result = await AuditModel.getObservationById(observation_id);
    if (!result) return res.status(404).json({ sts: '0', message: 'Not found' });
    return res.json({ sts: '1', message: 'OK', result });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.createObservation = async (req, res) => {
  try {
    const {
      audit_year, audit_area_id, division_id, observation_title,
      risk_rating, details_of_findings, followup_commitment,
      responsible_person_id, initial_target_date, subsequent_followup_1,
      updated_target_date_1, status,
    } = req.body;

    if (!audit_year || !observation_title || !risk_rating ||
        !details_of_findings || !followup_commitment || !responsible_person_id || !initial_target_date) {
      return res.status(400).json({ sts: '0', message: 'Required fields missing' });
    }
    if (!VALID_RATINGS.includes(risk_rating))
      return res.status(400).json({ sts: '0', message: `risk_rating must be one of: ${VALID_RATINGS.join(', ')}` });
    if (status && !VALID_STATUSES.includes(status))
      return res.status(400).json({ sts: '0', message: `status must be one of: ${VALID_STATUSES.join(', ')}` });

    const result = await AuditModel.createObservation({
      audit_year, audit_area_id, division_id, observation_title,
      risk_rating, details_of_findings, followup_commitment,
      responsible_person_id, initial_target_date, subsequent_followup_1,
      updated_target_date_1, status,
      created_by_user_id: req.body.created_by_user_id || req.headers['x-user-id'] || 1,
    });

    return res.status(201).json({ sts: '1', message: 'Created', result });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.updateObservation = async (req, res) => {
  try {
    const { observation_id, ...fields } = req.body;
    if (!observation_id) return res.status(400).json({ sts: '0', message: 'observation_id required' });
    if (fields.risk_rating && !VALID_RATINGS.includes(fields.risk_rating))
      return res.status(400).json({ sts: '0', message: `Invalid risk_rating` });
    if (fields.status && !VALID_STATUSES.includes(fields.status))
      return res.status(400).json({ sts: '0', message: `Invalid status` });

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Not found' });

    const result = await AuditModel.updateObservation(observation_id, fields);
    return res.json({ sts: '1', message: 'Updated', result });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.closeObservation = async (req, res) => {
  try {
    const { observation_id, closure_date, closure_remarks } = req.body;
    if (!observation_id) return res.status(400).json({ sts: '0', message: 'observation_id required' });

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Not found' });
    if (existing.status === 'Closed')
      return res.status(400).json({ sts: '0', message: 'Already closed' });

    const result = await AuditModel.closeObservation(observation_id, {
      closure_date, closure_remarks,
      closed_by_user_id: req.body.closed_by_user_id || req.headers['x-user-id'] || 1,
    });
    return res.json({ sts: '1', message: 'Closed', result });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

exports.deleteObservation = async (req, res) => {
  try {
    const { observation_id } = req.body;
    if (!observation_id) return res.status(400).json({ sts: '0', message: 'observation_id required' });
    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Not found' });
    await AuditModel.deleteObservation(observation_id);
    return res.json({ sts: '1', message: 'Deleted', result: { observation_id } });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

// ─── ANNEXURES ────────────────────────────────────────────────────────────────

/**
 * POST /api/audit/annexures/upload
 * Body (multipart): observation_id (form field), files[] (multer field 'files')
 */
exports.uploadAnnexures = async (req, res) => {
  try {
    const { observation_id } = req.body;
    if (!observation_id)
      return res.status(400).json({ sts: '0', message: 'observation_id is required' });
    if (!req.files || !req.files.length)
      return res.status(400).json({ sts: '0', message: 'At least one file is required' });

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Observation not found' });

    const uploaded_by = req.body.uploaded_by_user_id || req.headers['x-user-id'] || 1;
    const rows = await AuditModel.insertAnnexures(observation_id, req.files, uploaded_by);

    return res.status(201).json({
      sts: '1',
      message: `${rows.length} file(s) uploaded`,
      result: rows.map((r) => ({
        annexure_id:   r.annexure_id,
        observation_id: r.observation_id,
        original_name: r.original_name,
        file_size:     r.file_size,
        mime_type:     r.mime_type,
        uploaded_at:   r.uploaded_at,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * GET /api/audit/annexures/:observationId
 */
exports.listAnnexures = async (req, res) => {
  try {
    const rows = await AuditModel.getAnnexures(req.params.observationId);
    return res.json({ sts: '1', message: 'OK', result: rows });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * GET /api/audit/annexures/download/:annexureId
 */
exports.downloadAnnexure = async (req, res) => {
  try {
    const row = await AuditModel.getAnnexureById(req.params.annexureId);
    if (!row) return res.status(404).json({ sts: '0', message: 'File not found' });

    const filePath = path.resolve(__dirname, '..', row.file_path);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ sts: '0', message: 'File missing on disk' });

    res.download(filePath, row.original_name);
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * DELETE /api/audit/annexures/:annexureId
 */
exports.deleteAnnexure = async (req, res) => {
  try {
    const row = await AuditModel.deleteAnnexure(req.params.annexureId);
    if (!row) return res.status(404).json({ sts: '0', message: 'Not found' });
    // Delete physical file
    const filePath = path.resolve(__dirname, '..', row.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.json({ sts: '1', message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

// ─── FOLLOW-UPS ───────────────────────────────────────────────────────────────

/**
 * POST /api/audit/followups/add
 * Body (multipart): observation_id, responsible_person_id, remarks,
 *                   updated_target_date (optional), files[] (optional)
 */
exports.addFollowup = async (req, res) => {
  try {
    const { observation_id, responsible_person_id, remarks, updated_target_date } = req.body;
    if (!observation_id || !remarks)
      return res.status(400).json({ sts: '0', message: 'observation_id and remarks are required' });

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Observation not found' });
    if (existing.status === 'Closed')
      return res.status(400).json({ sts: '0', message: 'Observation is already closed' });

    const followup = await AuditModel.addFollowup({
      observation_id,
      responsible_person_id: responsible_person_id || null,
      remarks,
      updated_target_date: updated_target_date || null,
      action_type: 'update',
    });

    // If target date provided, also update the observation's updated_target_date_1
    if (updated_target_date) {
      await AuditModel.updateObservation(observation_id, {
        updated_target_date_1: updated_target_date,
        subsequent_followup_1: remarks,
      });
    }

    let evidenceFiles = [];
    if (req.files && req.files.length) {
      evidenceFiles = await AuditModel.insertEvidenceFiles(followup.followup_id, req.files);
    }

    return res.status(201).json({
      sts: '1',
      message: 'Follow-up added',
      result: { ...followup, evidence_files: evidenceFiles },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * GET /api/audit/followups/:observationId
 */
exports.listFollowups = async (req, res) => {
  try {
    const rows = await AuditModel.getFollowups(req.params.observationId);
    return res.json({ sts: '1', message: 'OK', result: rows });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * POST /api/audit/followups/request-closure
 * Responsible person requests closure — sets status to 'Request Closure'
 * Body (multipart): observation_id, responsible_person_id, remarks, files[] (optional)
 */
exports.requestClosure = async (req, res) => {
  try {
    const { observation_id, responsible_person_id, remarks } = req.body;
    if (!observation_id || !remarks)
      return res.status(400).json({ sts: '0', message: 'observation_id and remarks are required' });

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Observation not found' });
    if (existing.status === 'Closed')
      return res.status(400).json({ sts: '0', message: 'Already closed' });

    // Add a followup record with action_type = 'request_closure'
    const followup = await AuditModel.addFollowup({
      observation_id,
      responsible_person_id: responsible_person_id || null,
      remarks,
      updated_target_date: null,
      action_type: 'request_closure',
    });

    let evidenceFiles = [];
    if (req.files && req.files.length) {
      evidenceFiles = await AuditModel.insertEvidenceFiles(followup.followup_id, req.files);
    }

    // Update observation status to 'Request Closure'
    await AuditModel.updateObservation(observation_id, { status: 'Request Closure' });

    const updatedObs = await AuditModel.getObservationById(observation_id);

    return res.json({
      sts: '1',
      message: 'Closure requested. Pending auditor approval.',
      result: {
        observation: updatedObs,
        followup: { ...followup, evidence_files: evidenceFiles },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * POST /api/audit/approve-close
 * Auditor approves closure — final close of the observation
 * Body: observation_id, closure_date, closure_remarks, closed_by_user_id
 */
exports.approveClose = async (req, res) => {
  try {
    const { observation_id, closure_date, closure_remarks } = req.body;
    if (!observation_id)
      return res.status(400).json({ sts: '0', message: 'observation_id is required' });
    if (!closure_remarks)
      return res.status(400).json({ sts: '0', message: 'closure_remarks is required' });

    const existing = await AuditModel.getObservationById(observation_id);
    if (!existing) return res.status(404).json({ sts: '0', message: 'Not found' });
    if (existing.status === 'Closed')
      return res.status(400).json({ sts: '0', message: 'Already closed' });
    if (existing.status !== 'Request Closure')
      return res.status(400).json({
        sts: '0',
        message: `Observation status is '${existing.status}'. Only 'Request Closure' observations can be approved.`,
      });

    const result = await AuditModel.closeObservation(observation_id, {
      closure_date: closure_date || new Date().toISOString().split('T')[0],
      closure_remarks,
      closed_by_user_id: req.body.closed_by_user_id || req.headers['x-user-id'] || 1,
    });

    return res.json({ sts: '1', message: 'Observation closed by auditor', result });
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};

/**
 * GET /api/audit/evidence/download/:fileId
 */
exports.downloadEvidence = async (req, res) => {
  try {
    const row = await AuditModel.getEvidenceFileById(req.params.fileId);
    if (!row) return res.status(404).json({ sts: '0', message: 'File not found' });
    const filePath = path.resolve(__dirname, '..', row.file_path);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ sts: '0', message: 'File missing on disk' });
    res.download(filePath, row.original_name);
  } catch (error) {
    return res.status(500).json({ sts: '0', message: error.message });
  }
};
