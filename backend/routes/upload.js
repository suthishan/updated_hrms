'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { observations, users, uploadHistory } = require('../data/mockData');
const emailService = require('../services/emailService');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(xlsx?|csv)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed'));
    }
  },
});

// Required columns (0-indexed positions in the sheet)
const COL = {
  AUDIT_YEAR: 0, AUDIT_AREA: 1, DIVISION: 2, OBSERVATION: 3, RISK_RATING: 4,
  DETAILS_OF_FINDINGS: 5, MANAGEMENT_COMMITMENT: 6, RESPONSIBLE_PERSON: 7,
  INITIAL_TARGET_DATE: 8, FOLLOWUP_1: 9, UPDATED_DATE_1: 10, STATUS: 11,
};

const VALID_RATINGS = new Set(['High', 'Medium', 'Low', 'Improvement']);
const VALID_STATUSES = new Set(['Not Due', 'Overdue', 'Partially Open', 'Request Closure', 'Closed']);

function validateRow(row, rowIndex) {
  const errors = [];
  if (!row[COL.AUDIT_YEAR] || isNaN(Number(row[COL.AUDIT_YEAR]))) errors.push('Invalid Audit Year');
  if (!row[COL.AUDIT_AREA]) errors.push('Audit Area required');
  if (!row[COL.DIVISION]) errors.push('Division required');
  if (!row[COL.OBSERVATION]) errors.push('Observation required');
  if (!VALID_RATINGS.has(String(row[COL.RISK_RATING]).trim())) errors.push(`Invalid Risk Rating: "${row[COL.RISK_RATING]}"`);
  if (!row[COL.RESPONSIBLE_PERSON]) errors.push('Responsible Personnel required');
  if (!row[COL.INITIAL_TARGET_DATE]) errors.push('Initial Target Date required');
  const status = String(row[COL.STATUS] || 'Not Due').trim();
  if (status && !VALID_STATUSES.has(status)) errors.push(`Invalid Status: "${status}"`);
  return errors;
}

/**
 * POST /api/upload
 * Audit Team only — uploads Excel/CSV of observations
 */
router.post('/', authenticate, authorize('Audit Team'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' });

  let rows;
  try {
    const wb = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  } catch {
    return res.status(400).json({ message: 'Failed to parse file. Ensure it is a valid Excel or CSV file.' });
  }

  if (rows.length < 2) {
    return res.status(400).json({ message: 'File is empty or contains only headers' });
  }

  const dataRows = rows.slice(1); // skip header
  const validRows = [];
  const errorRows = [];
  const uploadErrors = [];

  // Group rows by observation text (same observation = multiple responsible persons)
  const obsGroups = {};

  dataRows.forEach((row, idx) => {
    const errors = validateRow(row, idx + 2);
    if (errors.length) {
      errorRows.push({ row: idx + 2, errors });
      uploadErrors.push(`Row ${idx + 2}: ${errors.join('; ')}`);
    } else {
      const obsKey = String(row[COL.OBSERVATION]).trim();
      if (!obsGroups[obsKey]) obsGroups[obsKey] = [];
      obsGroups[obsKey].push(row);
      validRows.push(row);
    }
  });

  let uploadedCount = 0;

  Object.entries(obsGroups).forEach(([obsKey, obsRows]) => {
    const firstRow = obsRows[0];
    const auditYear = parseInt(firstRow[COL.AUDIT_YEAR], 10);
    const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const observationId = `OBS-${auditYear}-${rand}`;
    const now = new Date().toISOString().split('T')[0];

    const actionItems = obsRows.map((row, idx) => {
      const personName = String(row[COL.RESPONSIBLE_PERSON]).trim();
      const existingUser = users.find((u) =>
        u.name.toLowerCase().includes(personName.toLowerCase())
      );
      const targetDate = row[COL.INITIAL_TARGET_DATE]
        ? (row[COL.INITIAL_TARGET_DATE] instanceof Date
          ? row[COL.INITIAL_TARGET_DATE].toISOString().split('T')[0]
          : String(row[COL.INITIAL_TARGET_DATE]))
        : '';

      return {
        id: `AI-${rand}-${String(idx + 1).padStart(2, '0')}`,
        observationId,
        responsiblePersonId: existingUser?.id ?? `EXT-${uuidv4().slice(0, 8)}`,
        responsiblePersonName: personName,
        responsiblePersonEmail: existingUser?.email ?? '',
        department: existingUser?.department ?? '',
        division: existingUser?.division ?? String(firstRow[COL.DIVISION]).trim(),
        initialTargetDate: targetDate,
        currentTargetDate: targetDate,
        status: String(row[COL.STATUS] || 'Not Due').trim(),
        actionTaken: null, managementComment: null,
        auditorConfirmationStatus: 'Pending', auditorConfirmationComment: null, closureDate: null,
        followUps: row[COL.FOLLOWUP_1]
          ? [{ id: uuidv4(), actionItemId: `AI-${rand}-${String(idx + 1).padStart(2, '0')}`,
              date: now, remarks: String(row[COL.FOLLOWUP_1]), addedBy: 'UPLOAD', addedByName: 'Excel Upload' }]
          : [],
        targetDateRevisions: row[COL.UPDATED_DATE_1]
          ? [{ id: uuidv4(), actionItemId: `AI-${rand}-${String(idx + 1).padStart(2, '0')}`,
              previousDate: targetDate, newDate: String(row[COL.UPDATED_DATE_1]),
              reason: 'Uploaded via Excel', revisedDate: now,
              revisedBy: req.user.id, revisedByName: req.user.name }]
          : [],
      };
    });

    const newObs = {
      id: uuidv4(),
      observationId,
      auditYear,
      auditArea: String(firstRow[COL.AUDIT_AREA]).trim(),
      division: String(firstRow[COL.DIVISION]).trim(),
      riskRating: String(firstRow[COL.RISK_RATING]).trim(),
      observation: obsKey,
      detailsOfFindings: String(firstRow[COL.DETAILS_OF_FINDINGS] || '').trim(),
      managementCommitment: String(firstRow[COL.MANAGEMENT_COMMITMENT] || '').trim(),
      auditorClosureComment: null,
      overallStatus: 'Open',
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdDate: now,
      publishedDate: now,
      isPublished: true,
      actionItems,
    };

    observations.push(newObs);
    uploadedCount++;

    // Notify responsible persons
    actionItems.forEach((ai) => {
      if (ai.responsiblePersonEmail) {
        emailService.sendAssignmentNotification(ai, newObs).catch(console.error);
      }
    });
  });

  const historyEntry = {
    id: uuidv4(),
    fileName: req.file.originalname,
    uploadDate: new Date().toISOString().split('T')[0],
    uploadedBy: req.user.id,
    uploadedByName: req.user.name,
    recordsUploaded: uploadedCount,
    status: errorRows.length === 0 ? 'Success' : uploadedCount > 0 ? 'Partial' : 'Failed',
    errors: uploadErrors,
  };
  uploadHistory.push(historyEntry);

  res.json({
    message: `Upload complete. ${uploadedCount} observations created, ${errorRows.length} rows had errors.`,
    uploadedCount,
    errorCount: errorRows.length,
    errors: errorRows,
    historyEntry,
  });
});

/**
 * GET /api/upload/history
 */
router.get('/history', authenticate, authorize('Audit Team'), (req, res) => {
  res.json({ data: uploadHistory, totalData: uploadHistory.length });
});

/**
 * GET /api/upload/template
 * Returns the CSV template as a downloadable file
 */
router.get('/template', authenticate, (req, res) => {
  const headers = [
    'Audit Year', 'Audit Area', 'Division', 'Observation', 'Risk Rating',
    'Details of Findings', 'Follow-up Commitment from Management',
    'Responsible Personnel', 'Initial Target Date',
    'Subsequent Follow Up 1', 'Updated Target Date 1', 'Status',
    'Subsequent Follow Up 2', 'Updated Target Date 2',
    'Auditor Closure Comment', 'Management Comment',
  ];
  const sampleRow = [
    '2024', 'Procurement', 'Supply Chain', 'Vendor due diligence gaps', 'High',
    'Vendor DD not performed for 3 new suppliers.', 'Implement DD checklist before Q3.',
    'Anjali Sharma', '2024-09-30', '', '', 'Not Due', '', '', '', '',
  ];
  const csv = [headers, sampleRow].map((r) => r.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="Audit_CAR_Upload_Template.csv"');
  res.send(csv);
});

module.exports = router;
