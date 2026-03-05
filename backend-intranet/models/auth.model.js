const pool = require('../db/db');

exports.findUserByEmpId = async (empId) => {
  const query = `
    SELECT
      e.eid,
      e.emp_id,
      e.emp_department,
      e.emp_designation,
      e.emp_password,
      e.emp_uuid,
      e.emp_name,
      e.emp_email,
      e.emp_status,
      e.mobile_number,
      COALESCE(
        ARRAY_AGG(r.role ORDER BY r.role DESC) 
        FILTER (WHERE r.role IS NOT NULL),
        '{}'
      ) AS roles
    FROM tbl_emp_master e
    LEFT JOIN tbl_employee_role r
      ON r.employee_id = e.emp_uuid
    WHERE e.emp_id = $1
      AND e.emp_status = 'active'
    GROUP BY
      e.eid,
      e.emp_id,
      e.emp_department,
      e.emp_designation,
      e.emp_password,
      e.emp_uuid,
      e.emp_name,
      e.emp_status;
  `;

  const result = await pool.query(query, [empId]);
  return result.rows[0];
};


exports.storeRefreshToken = async (empUuid, refreshToken, expiresAt) => {
  const query = `
    INSERT INTO tbl_refresh_tokens
    (emp_uuid, refresh_token, expires_at)
    VALUES ($1, $2, $3)
  `;

  await pool.query(query, [
    empUuid,
    refreshToken,
    expiresAt
  ]);
};

exports.findValidRefreshToken = async (refreshToken) => {
  const query = `
    SELECT
      rt.emp_uuid,
      e.emp_role,
      e.emp_department
    FROM tbl_refresh_tokens rt
    JOIN tbl_emp_master e
      ON e.emp_uuid = rt.emp_uuid
    WHERE rt.refresh_token = $1
      AND rt.is_revoked = false
      AND rt.expires_at > NOW()
    LIMIT 1
  `;

  const res = await pool.query(query, [refreshToken]);
  return res.rows[0];
};

exports.revokeRefreshToken = async (refreshToken) => {
  const query = `
    UPDATE tbl_refresh_tokens
    SET is_revoked = true
    WHERE refresh_token = $1
  `;

  await pool.query(query, [refreshToken]);
};

exports.rotateRefreshToken = async (oldToken, newToken, newExpiry) => {
  await pool.query('BEGIN');

  await pool.query(`
    UPDATE tbl_refresh_tokens
    SET is_revoked = true
    WHERE refresh_token = $1
  `, [oldToken]);

  await pool.query(`
    INSERT INTO tbl_refresh_tokens
    (emp_uuid, refresh_token, expires_at)
    SELECT emp_uuid, $2, $3
    FROM tbl_refresh_tokens
    WHERE refresh_token = $1
  `, [oldToken, newToken, newExpiry]);

  await pool.query('COMMIT');
};

