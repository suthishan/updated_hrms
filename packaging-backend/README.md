# Packaging Creative Approval Portal — Backend

Node.js / Express backend for the Packaging Creative Approval Portal.

## Setup

```bash
cd packaging-backend
npm install
npm run dev    # development with auto-reload
npm start      # production
```

The server starts at **http://localhost:3100**.

## API Reference

### Approvers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/approvers` | List all approvers. Supports `?search`, `?location`, `?active` |
| GET | `/api/approvers/:id` | Get a single approver |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List documents. Supports `?status`, `?workflow`, `?initiatorEmail`, `?search` |
| GET | `/api/documents/:id` | Get full document detail |
| POST | `/api/documents` | Create document (multipart/form-data). Fields: `title`, `productName`, `productCategory`, `batchRef`, `description`, `initiator`, `initiatorEmail`. Files field: `files[]` (PDF/JPEG only, max 10MB each) |
| PATCH | `/api/documents/:id/configure` | Configure workflow. Body: `{ workflowType: "sequential"|"parallel"|"hybrid", steps: [{ stepType, approverIds: ["APR001",...] }], initiatorEmail }` |
| PATCH | `/api/documents/:id/decide` | Take approval action. Body: `{ approverId, decision: "approved"|"rejected", remarks }` |
| GET | `/api/documents/:id/download-info` | Get file download info (approved docs only) |

### Audit Trail

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit` | Full audit trail. Supports `?documentId`, `?actionType`, `?performedBy`, `?from`, `?to` |
| GET | `/api/audit/document/:documentId` | Audit trail for a specific document |

## File Uploads

- Accepted: **PDF** and **JPEG** only
- Max size: **10MB per file**
- Up to **10 files** per document
- Stored in `packaging-backend/uploads/`
- Served at `/uploads/:filename`

## Workflow Types

| Type | Behaviour |
|------|-----------|
| `sequential` | Each step completes before the next begins |
| `parallel` | A single step with all approvers acting simultaneously |
| `hybrid` | Mix of sequential steps, each of which can be parallel |

## Approver Decision Flow

```
POST /api/documents          → status: "draft"
PATCH /:id/configure         → status: "pending" → "in-review"
PATCH /:id/decide (approved) → moves to next step or "approved"
PATCH /:id/decide (rejected) → status: "rejected", notifies initiator
```

## Production Considerations

- Replace the in-memory store (`data/store.js`) with PostgreSQL or MongoDB
- Add JWT authentication middleware
- Configure a real SMTP server via `nodemailer` for email notifications
- Move file storage to S3 or equivalent cloud storage
- Add rate limiting with `express-rate-limit`
