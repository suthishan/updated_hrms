'use strict';
const pool = require('../db/db');

// ─── STAGING MODEL ────────────────────────────────────────────────────────────

exports.insertBatch = async (rows, batchId, filename, uploadedByUserId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertedRows = [];
    for (const row of rows) {
      const result = await client.query(
        `INSERT INTO tbl_audit_observations_staging
          (batch_id, upload_filename, audit_year, audit_area, division,
           observation_title, risk_rating, details_of_findings, followup_commitment,
           responsible_person, initial_target_date, subsequent_followup_1,
           updated_target_date_1, status, uploaded_by_user_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         RETURNING *`,
        [
          batchId, filename,
          row.audit_year, row.audit_area, row.division,
          row.observation_title, row.risk_rating, row.details_of_findings,
          row.followup_commitment, row.responsible_person,
          row.initial_target_date, row.subsequent_followup_1,
          row.updated_target_date_1, row.status || 'Open',
          uploadedByUserId,
        ]
      );
      insertedRows.push(result.rows[0]);
    }
    await client.query('COMMIT');
    return insertedRows;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.getByBatch = async (batchId) => {
  const result = await pool.query(
    `SELECT * FROM tbl_audit_observations_staging WHERE batch_id = $1 ORDER BY staging_id`,
    [batchId]
  );
  return result.rows;
};

exports.getPendingRows = async (batchId = null) => {
  const query = batchId
    ? `SELECT * FROM tbl_audit_observations_staging WHERE sync_status = 'Error' AND batch_id = $1 ORDER BY staging_id`
    : `SELECT * FROM tbl_audit_observations_staging WHERE sync_status = 'Error' ORDER BY staging_id`;
  const result = await pool.query(query, batchId ? [batchId] : []);
  return result.rows;
};

exports.markSynced = async (stagingId, observationId) => {
  await pool.query(
    `UPDATE tbl_audit_observations_staging
     SET sync_status = 'Synced', synced_observation_id = $1, synced_at = NOW()
     WHERE staging_id = $2`,
    [observationId, stagingId]
  );
};

exports.markError = async (stagingId, errorMsg) => {
  await pool.query(
    `UPDATE tbl_audit_observations_staging
     SET sync_status = 'Error', sync_error = $1
     WHERE staging_id = $2`,
    [errorMsg, stagingId]
  );
};

exports.getBatchSummary = async (batchId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE sync_status = 'Pending') AS pending,
       COUNT(*) FILTER (WHERE sync_status = 'Synced')  AS synced,
       COUNT(*) FILTER (WHERE sync_status = 'Error')   AS error,
       COUNT(*) AS total
     FROM tbl_audit_observations_staging
     WHERE batch_id = $1`,
    [batchId]
  );
  return result.rows[0];
};

exports.listBatches = async () => {
  const result = await pool.query(
    `SELECT batch_id, upload_filename, uploaded_by_user_id, MIN(created_at) AS uploaded_at,
            COUNT(*) AS total_rows,
            COUNT(*) FILTER (WHERE sync_status = 'Synced') AS synced,
            COUNT(*) FILTER (WHERE sync_status = 'Error')  AS errors
     FROM tbl_audit_observations_staging
     GROUP BY batch_id, upload_filename, uploaded_by_user_id
     ORDER BY MIN(created_at) DESC`
  );
  return result.rows;
};

exports.resetErrorRows = async (batchId) => {
  await pool.query(
    `UPDATE tbl_audit_observations_staging
     SET sync_status = 'Pending', sync_error = NULL
     WHERE batch_id = $1 AND sync_status = 'Error'`,
    [batchId]
  );
};

// ─── OBSERVATION MASTER MODEL ─────────────────────────────────────────────────

const OBS_JOINS = `
  FROM tbl_audit_observations o
  LEFT JOIN tbl_audit_areas  aa ON aa.id  = o.audit_area_id
  LEFT JOIN tbl_divisions     d  ON d.id   = o.division_id
  LEFT JOIN tbl_emp_master   rp  ON rp.eid = o.responsible_person_id
  LEFT JOIN tbl_emp_master   cb  ON cb.eid = o.closed_by_user_id
  LEFT JOIN tbl_emp_master   cr  ON cr.eid = o.created_by_user_id
`;

exports.getAllObservations = async ({ audit_year, status, risk_rating, division_id, audit_area_id, limit, offset }) => {
  const conditions = [];
  const params = [];
  let i = 1;

  if (audit_year)    { conditions.push(`o.audit_year = $${i++}`);    params.push(audit_year); }
  if (status)        { conditions.push(`o.status = $${i++}`);        params.push(status); }
  if (risk_rating)   { conditions.push(`o.risk_rating = $${i++}`);   params.push(risk_rating); }
  if (division_id)   { conditions.push(`o.division_id = $${i++}`);   params.push(division_id); }
  if (audit_area_id) { conditions.push(`o.audit_area_id = $${i++}`); params.push(audit_area_id); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit || 20);
  params.push(offset || 0);

  const result = await pool.query(
    `SELECT
        o.observation_id, o.observation_number, o.audit_year,
        o.observation_title, o.risk_rating, o.details_of_findings,
        o.followup_commitment, o.subsequent_followup_1,
        o.initial_target_date, o.updated_target_date_1,
        o.status, o.closure_date, o.closure_remarks,
        o.created_at, o.updated_at,
        aa.area_name         AS audit_area,
        d.division_name      AS division,
        rp.emp_name          AS responsible_person,
        rp.emp_code          AS responsible_person_code,
        cb.emp_name          AS closed_by,
        cr.emp_name          AS created_by,
        (SELECT COUNT(*) FROM tbl_audit_annexures a WHERE a.observation_id = o.observation_id) AS annexure_count
     ${OBS_JOINS}
     ${where}
     ORDER BY o.created_at DESC
     LIMIT $${i++} OFFSET $${i++}`,
    params
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) ${OBS_JOINS} ${where}`,
    params.slice(0, -2)
  );

  return { rows: result.rows, total: parseInt(countResult.rows[0].count) };
};

exports.getObservationById = async (observation_id) => {
  const result = await pool.query(
    `SELECT
        o.*,
        aa.area_name         AS audit_area,
        d.division_name      AS division,
        rp.emp_name          AS responsible_person,
        rp.emp_code          AS responsible_person_code,
        rp.emp_email         AS responsible_person_email,
        cb.emp_name          AS closed_by,
        cr.emp_name          AS created_by
     ${OBS_JOINS}
     WHERE o.observation_id = $1`,
    [observation_id]
  );
  return result.rows[0] || null;
};

exports.createObservation = async ({
  audit_year, audit_area_id, division_id, observation_title,
  risk_rating, details_of_findings, followup_commitment,
  responsible_person_id, initial_target_date, subsequent_followup_1,
  updated_target_date_1, status, created_by_user_id,
}) => {
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tbl_audit_observations WHERE audit_year = $1`, [audit_year]
  );
  const seq = parseInt(countResult.rows[0].count) + 1;
  const observation_number = `OBS-${audit_year}-${String(seq).padStart(4, '0')}`;

  const result = await pool.query(
    `INSERT INTO tbl_audit_observations
      (observation_number, audit_year, audit_area_id, division_id, observation_title,
       risk_rating, details_of_findings, followup_commitment, responsible_person_id,
       initial_target_date, subsequent_followup_1, updated_target_date_1, status, created_by_user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
      observation_number, audit_year, audit_area_id || null, division_id || null,
      observation_title, risk_rating, details_of_findings, followup_commitment,
      responsible_person_id, initial_target_date,
      subsequent_followup_1 || null, updated_target_date_1 || null,
      status || 'Open', created_by_user_id,
    ]
  );
  return result.rows[0];
};

exports.updateObservation = async (observation_id, fields) => {
  const allowed = [
    'audit_area_id', 'division_id', 'observation_title', 'risk_rating',
    'details_of_findings', 'followup_commitment', 'responsible_person_id',
    'initial_target_date', 'subsequent_followup_1', 'updated_target_date_1', 'status',
  ];

  const setClauses = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key} = $${i++}`);
      params.push(fields[key]);
    }
  }

  if (!setClauses.length) return null;
  params.push(observation_id);

  const result = await pool.query(
    `UPDATE tbl_audit_observations
     SET ${setClauses.join(', ')}, updated_at = NOW()
     WHERE observation_id = $${i}
     RETURNING *`,
    params
  );
  return result.rows[0] || null;
};

exports.closeObservation = async (observation_id, { closure_date, closure_remarks, closed_by_user_id }) => {
  const result = await pool.query(
    `UPDATE tbl_audit_observations
     SET status = 'Closed',
         closure_date = $1, closure_remarks = $2,
         closed_by_user_id = $3, updated_at = NOW()
     WHERE observation_id = $4
     RETURNING *`,
    [closure_date || new Date(), closure_remarks || null, closed_by_user_id, observation_id]
  );
  return result.rows[0] || null;
};

exports.deleteObservation = async (observation_id) => {
  const result = await pool.query(
    `DELETE FROM tbl_audit_observations WHERE observation_id = $1 RETURNING observation_id`,
    [observation_id]
  );
  return result.rows[0] || null;
};

exports.insertObservation = exports.createObservation;

exports.findAuditAreaByName = async (name) => {
  const result = await pool.query(
    `SELECT id FROM tbl_audit_areas WHERE LOWER(area_name) = LOWER($1) LIMIT 1`, [name]
  );
  return result.rows[0]?.id || null;
};

exports.findDivisionByName = async (name) => {
  const result = await pool.query(
    `SELECT id FROM tbl_divisions WHERE LOWER(division_name) = LOWER($1) LIMIT 1`, [name]
  );
  return result.rows[0]?.id || null;
};

exports.findEmployeeByNameOrCode = async (nameOrCode) => {
  const cleanedInput = nameOrCode
    .replace(/\b(mr|mrs|ms|dr)\.?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  const tokens = cleanedInput.split(' ').filter(Boolean);
  if (!tokens.length) return null;

  const conditions = tokens.map((_, idx) =>
    `LOWER(emp_name) ILIKE '%' || $${idx + 1} || '%'`
  ).join(' AND ');

  const result = await pool.query(
    `SELECT eid FROM tbl_emp_master
     WHERE ${conditions}
     ORDER BY similarity(LOWER(emp_name), $${tokens.length + 1}) DESC
     LIMIT 1`,
    [...tokens, cleanedInput]
  );
  return result.rows[0]?.eid || null;
};

// ─── ANNEXURES ────────────────────────────────────────────────────────────────

exports.insertAnnexures = async (observation_id, files, uploaded_by_user_id) => {
  if (!files || !files.length) return [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = [];
    for (const f of files) {
      const r = await client.query(
        `INSERT INTO tbl_audit_annexures
           (observation_id, file_name, original_name, file_size, mime_type, file_path, uploaded_by_user_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [
          observation_id, f.filename, f.originalname,
          f.size, f.mimetype || 'application/octet-stream',
          f.path, uploaded_by_user_id || null,
        ]
      );
      inserted.push(r.rows[0]);
    }
    await client.query('COMMIT');
    return inserted;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.getAnnexures = async (observation_id) => {
  const r = await pool.query(
    `SELECT a.*, e.emp_name AS uploaded_by_name
     FROM tbl_audit_annexures a
     LEFT JOIN tbl_emp_master e ON e.eid = a.uploaded_by_user_id
     WHERE a.observation_id = $1
     ORDER BY a.uploaded_at DESC`,
    [observation_id]
  );
  return r.rows;
};

exports.getAnnexureById = async (annexure_id) => {
  const r = await pool.query(
    `SELECT * FROM tbl_audit_annexures WHERE annexure_id = $1`, [annexure_id]
  );
  return r.rows[0] || null;
};

exports.deleteAnnexure = async (annexure_id) => {
  const r = await pool.query(
    `DELETE FROM tbl_audit_annexures WHERE annexure_id = $1 RETURNING *`, [annexure_id]
  );
  return r.rows[0] || null;
};

// ─── FOLLOW-UPS ───────────────────────────────────────────────────────────────

exports.addFollowup = async ({
  observation_id, responsible_person_id, remarks,
  updated_target_date, action_type,
}) => {
  const r = await pool.query(
    `INSERT INTO tbl_audit_followups
       (observation_id, responsible_person_id, remarks, updated_target_date, action_type)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      observation_id,
      responsible_person_id || null,
      remarks,
      updated_target_date || null,
      action_type || 'update',
    ]
  );
  return r.rows[0];
};

exports.getFollowups = async (observation_id) => {
  const r = await pool.query(
    `SELECT f.*,
            e.emp_name AS responsible_person_name,
            COALESCE(
              json_agg(
                json_build_object(
                  'file_id',       ev.file_id,
                  'followup_id',   ev.followup_id,
                  'file_name',     ev.file_name,
                  'original_name', ev.original_name,
                  'file_size',     ev.file_size,
                  'uploaded_at',   ev.uploaded_at
                ) ORDER BY ev.uploaded_at
              ) FILTER (WHERE ev.file_id IS NOT NULL),
              '[]'
            ) AS evidence_files
     FROM tbl_audit_followups f
     LEFT JOIN tbl_emp_master e ON e.eid = f.responsible_person_id
     LEFT JOIN tbl_audit_evidence_files ev ON ev.followup_id = f.followup_id
     WHERE f.observation_id = $1
     GROUP BY f.followup_id, e.emp_name
     ORDER BY f.created_at ASC`,
    [observation_id]
  );
  return r.rows;
};

exports.insertEvidenceFiles = async (followup_id, files) => {
  if (!files || !files.length) return [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = [];
    for (const f of files) {
      const r = await client.query(
        `INSERT INTO tbl_audit_evidence_files
           (followup_id, file_name, original_name, file_size, mime_type, file_path)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [
          followup_id, f.filename, f.originalname,
          f.size, f.mimetype || 'application/octet-stream', f.path,
        ]
      );
      inserted.push(r.rows[0]);
    }
    await client.query('COMMIT');
    return inserted;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.getEvidenceFileById = async (file_id) => {
  const r = await pool.query(
    `SELECT * FROM tbl_audit_evidence_files WHERE file_id = $1`, [file_id]
  );
  return r.rows[0] || null;
};
