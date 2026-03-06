const pool = require('../db/db');

exports.saveAttachment = async (req, res) => {
  const { request_id } = req.body;

  await pool.query(
    `INSERT INTO attachments
     (request_id, file_name, file_path, uploaded_by)
     VALUES ($1,$2,$3,$4)`,
    [
      request_id,
      req.file.originalname,
      req.file.path,
      req.user.name
    ]
  );

  res.json({ success: true });
};
