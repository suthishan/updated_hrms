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
          uploadedByUserId
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

exports.insertObservation = async ({
  audit_year, audit_area_id, division_id, observation_title,
  risk_rating, details_of_findings, followup_commitment,
  responsible_person_id, initial_target_date, subsequent_followup_1,
  updated_target_date_1, status, created_by_user_id
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
      observation_number, audit_year, audit_area_id, division_id, observation_title,
      risk_rating, details_of_findings, followup_commitment, responsible_person_id,
      initial_target_date || null, subsequent_followup_1 || null,
      updated_target_date_1 || null, status || 'Open', created_by_user_id
    ]
  );
  return result.rows[0];
};

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

  // 1️⃣ Normalize Input
  const cleanedInput = nameOrCode
    .replace(/\b(mr|mrs|ms|dr)\.?/gi, '')  // remove titles
    .replace(/\s+/g, ' ')                  // remove extra spaces
    .trim()
    .toLowerCase();

  const tokens = cleanedInput.split(' ').filter(Boolean);

  if (tokens.length === 0) return null;

  // 2️⃣ Build dynamic token condition
  const conditions = tokens.map((_, index) => 
    `LOWER(emp_name) ILIKE '%' || $${index + 1} || '%'`
  ).join(' AND ');

  const query = `
      SELECT eid
      FROM tbl_emp_master
      WHERE ${conditions}
      ORDER BY similarity(LOWER(emp_name), $${tokens.length + 1}) DESC
      LIMIT 1
  `;

  const result = await pool.query(query, [...tokens, cleanedInput]);

  return result.rows[0]?.eid || null;
};


exports.getAllObservations = async ({ audit_year, status, risk_rating, division_id, audit_area_id, limit, offset }) => {
  const conditions = [];
  const params = [];
  let i = 1;

  if (audit_year)    { conditions.push(`o.audit_year = $${i++}`);       params.push(audit_year); }
  if (status)        { conditions.push(`o.status = $${i++}`);           params.push(status); }
  if (risk_rating)   { conditions.push(`o.risk_rating = $${i++}`);      params.push(risk_rating); }
  if (division_id)   { conditions.push(`o.division_id = $${i++}`);      params.push(division_id); }
  if (audit_area_id) { conditions.push(`o.audit_area_id = $${i++}`);    params.push(audit_area_id); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit || 20);
  params.push(offset || 0);

  const result = await pool.query(
    `SELECT
        o.observation_id,
        o.observation_number,
        o.audit_year,
        o.observation_title,
        o.risk_rating,
        o.details_of_findings,
        o.followup_commitment,
        o.subsequent_followup_1,
        o.initial_target_date,
        o.updated_target_date_1,
        o.status,
        o.closure_date,
        o.closure_remarks,
        o.created_at,
        o.updated_at,
        aa.area_name         AS audit_area,
        d.division_name      AS division,
        rp.emp_name          AS responsible_person,
        rp.emp_code          AS responsible_person_code,
        cb.emp_name          AS closed_by,
        cr.emp_name          AS created_by
     FROM tbl_audit_observations o
     LEFT JOIN tbl_audit_areas  aa ON aa.id  = o.audit_area_id
     LEFT JOIN tbl_divisions     d  ON d.id   = o.division_id
     LEFT JOIN tbl_emp_master   rp  ON rp.eid = o.responsible_person_id
     LEFT JOIN tbl_emp_master   cb  ON cb.eid = o.closed_by_user_id
     LEFT JOIN tbl_emp_master   cr  ON cr.eid = o.created_by_user_id
     ${where}
     ORDER BY o.created_at DESC
     LIMIT $${i++} OFFSET $${i++}`,
    params
  );

  // total count for pagination
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tbl_audit_observations o ${where}`,
    params.slice(0, -2)
  );

  return { rows: result.rows, total: parseInt(countResult.rows[0].count) };
};

// ─── GET SINGLE OBSERVATION ───────────────────────────────────────────────────

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
     FROM tbl_audit_observations o
     LEFT JOIN tbl_audit_areas  aa ON aa.id  = o.audit_area_id
     LEFT JOIN tbl_divisions     d  ON d.id   = o.division_id
     LEFT JOIN tbl_emp_master   rp  ON rp.eid = o.responsible_person_id
     LEFT JOIN tbl_emp_master   cb  ON cb.eid = o.closed_by_user_id
     LEFT JOIN tbl_emp_master   cr  ON cr.eid = o.created_by_user_id
     WHERE o.observation_id = $1`,
    [observation_id]
  );
  return result.rows[0] || null;
};

// ─── CREATE OBSERVATION ───────────────────────────────────────────────────────

exports.createObservation = async ({
  audit_year, audit_area_id, division_id, observation_title,
  risk_rating, details_of_findings, followup_commitment,
  responsible_person_id, initial_target_date, subsequent_followup_1,
  updated_target_date_1, status, created_by_user_id
}) => {
  // Auto-generate observation number: OBS-YEAR-0001
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
      status || 'Open', created_by_user_id
    ]
  );
  return result.rows[0];
};

// ─── UPDATE OBSERVATION ───────────────────────────────────────────────────────

exports.updateObservation = async (observation_id, fields) => {
  const allowed = [
    'audit_area_id', 'division_id', 'observation_title', 'risk_rating',
    'details_of_findings', 'followup_commitment', 'responsible_person_id',
    'initial_target_date', 'subsequent_followup_1', 'updated_target_date_1', 'status'
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

  if (setClauses.length === 0) return null;

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

// ─── CLOSE OBSERVATION ────────────────────────────────────────────────────────

exports.closeObservation = async (observation_id, { closure_date, closure_remarks, closed_by_user_id }) => {
  const result = await pool.query(
    `UPDATE tbl_audit_observations
     SET status = 'Closed',
         closure_date = $1,
         closure_remarks = $2,
         closed_by_user_id = $3,
         updated_at = NOW()
     WHERE observation_id = $4
     RETURNING *`,
    [closure_date || new Date(), closure_remarks || null, closed_by_user_id, observation_id]
  );
  return result.rows[0] || null;
};

// ─── DELETE OBSERVATION ───────────────────────────────────────────────────────

exports.deleteObservation = async (observation_id) => {
  const result = await pool.query(
    `DELETE FROM tbl_audit_observations WHERE observation_id = $1 RETURNING observation_id`,
    [observation_id]
  );
  return result.rows[0] || null;
};

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

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
  const result = await pool.query(
    `SELECT eid FROM tbl_emp_master
     WHERE LOWER(emp_name) = LOWER($1) OR emp_code = $1 LIMIT 1`,
    [nameOrCode]
  );
  return result.rows[0]?.eid || null;
};