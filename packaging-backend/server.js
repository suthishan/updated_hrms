/**
 * Packaging Creative Approval Portal — Express Backend
 * ─────────────────────────────────────────────────────
 * Start: npm start  (or npm run dev for watch mode)
 * Base URL: http://localhost:3100
 *
 * API Endpoints:
 *
 *  Approvers
 *  GET    /api/approvers                  – List all approvers (supports ?search, ?location, ?active)
 *  GET    /api/approvers/:id              – Get single approver
 *
 *  Documents
 *  GET    /api/documents                  – List documents (supports ?status, ?workflow, ?initiatorEmail, ?search)
 *  GET    /api/documents/:id              – Get document detail
 *  POST   /api/documents                  – Create document (multipart/form-data with files)
 *  PATCH  /api/documents/:id/configure    – Configure workflow + approvers (changes draft → pending)
 *  PATCH  /api/documents/:id/decide       – Approver approves/rejects
 *  GET    /api/documents/:id/download-info– Get download info (approved docs only)
 *
 *  Audit Trail
 *  GET    /api/audit                      – Full audit trail (supports ?documentId, ?actionType, ?performedBy, ?from, ?to)
 *  GET    /api/audit/document/:documentId – Audit trail for a specific document
 *
 *  Static
 *  GET    /uploads/:filename              – Serve uploaded files
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const approversRouter = require('./routes/approvers');
const documentsRouter = require('./routes/documents');
const auditRouter     = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 3100;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/approvers', approversRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/audit',     auditRouter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'packaging-approval-backend', timestamp: new Date().toISOString() });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error.' });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Packaging Approval Backend running on http://localhost:${PORT}`);
  console.log(`   Health check : http://localhost:${PORT}/health`);
  console.log(`   Approvers API: http://localhost:${PORT}/api/approvers`);
  console.log(`   Documents API: http://localhost:${PORT}/api/documents`);
  console.log(`   Audit API    : http://localhost:${PORT}/api/audit\n`);
});

module.exports = app;
