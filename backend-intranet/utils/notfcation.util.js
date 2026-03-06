const pool = require('../db/db');

exports.createNotification = async ({ recipient_emp_uuid, message, link }) => {
  await pool.query(`
    INSERT INTO tbl_notifications (recipient_emp_uuid, message, link)
    VALUES ($1, $2, $3)
  `, [recipient_emp_uuid, message, link]);
}