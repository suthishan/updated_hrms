'use strict';
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Multer disk storage for audit annexures and evidence files.
 * Stores to  uploads/audit-files/  (relative to project root).
 * No file-type restriction — all formats accepted (PDF, DOCX, XLSX, images, etc.)
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.resolve(__dirname, '../uploads/audit-files');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
});
