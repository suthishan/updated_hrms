const pool = require('../db/db');

exports.auditLog = async ({
  user,
  action,
  entityType,
  entityId,
  oldValue = null,
  newValue = null,
  req
}) => {
  await pool.query(`
    INSERT INTO tbl_audit_logs
    (emp_uuid, emp_name, emp_role,
     action, entity_type, entity_id,
     old_value, new_value,
     ip_address, user_agent)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  `, [
    user.emp_uuid,
    user.emp_name,
    user.emp_role,
    action,
    entityType,
    entityId,
    oldValue,
    newValue,
    req.ip,
    req.headers['user-agent']
  ]);
};
