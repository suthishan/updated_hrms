/**
 * Packaging Creative Approval — Database Model
 * Follows the same pattern as request.model.js / approval.model.js
 * All queries operate on:
 *   tbl_requests          (generic request store — form_data JSONB holds packaging fields)
 *   tbl_approvals         (per-level approval status)
 *   tbl_packaging_files   (file attachments per request)
 *   tbl_packaging_approvers (approver pool for SelectApprovers UI)
 *   tbl_req_master        (request type master — PKG-CREATIVE row)
 *   tbl_audit_logs        (audit trail)
 */
const pool = require('../db/db');

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Resolve the rid (int) of the PKG-CREATIVE request type once per process. */
let _pkgTypeId = null;
async function getPkgTypeId() {
  if (_pkgTypeId) return _pkgTypeId;
  const { rows } = await pool.query(
    `SELECT rid FROM tbl_req_master WHERE req_doc_code = 'PKG-CREATIVE' LIMIT 1`
  );
  if (!rows.length) throw new Error("PKG-CREATIVE request type not found in tbl_req_master. Run packaging-approval.sql first.");
  _pkgTypeId = rows[0].rid;
  return _pkgTypeId;
}

// ---------------------------------------------------------------------------
// 1. Draft creation
//    Called by POST /api/packaging/create-draft
//    Returns the new tbl_requests row.
// ---------------------------------------------------------------------------
exports.createPackagingDraft = async ({ empUuid, requesterName, department, priority }) => {
  const pkgTypeId = await getPkgTypeId();
  const { rows } = await pool.query(
    `INSERT INTO tbl_requests
       (request_type_id, emp_id, requester_name, department, priority, form_data, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'DRAFT')
     RETURNING *`,
    [pkgTypeId, empUuid, requesterName, department, priority || 'NORMAL', '{}']
  );
  return rows[0];
};

// ---------------------------------------------------------------------------
// 2. Attach uploaded files to a draft
//    Called by POST /api/packaging/upload-files (multipart)
//    files = [{ originalname, mimetype, size, path }]  (multer disk storage)
// ---------------------------------------------------------------------------
exports.addPackagingFiles = async (requestId, files) => {
  if (!files || files.length === 0) return [];

  const placeholders = [];
  const values = [];
  files.forEach((f, idx) => {
    const base = idx * 5;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`);
    const ext = (f.mimetype === 'application/pdf') ? 'pdf' : 'jpeg';
    values.push(requestId, f.originalname, ext, f.size, f.path);
  });

  const { rows } = await pool.query(
    `INSERT INTO tbl_packaging_files (request_id, file_name, file_type, file_size, file_url)
     VALUES ${placeholders.join(', ')}
     RETURNING *`,
    values
  );
  return rows;
};

// ---------------------------------------------------------------------------
// 3. Save form metadata + workflow config; change status to SUBMITTED
//    Called by POST /api/packaging/submit
//    formData = { title, productName, productCategory, batchRef, description,
//                 workflowType, workflowSteps: [{stepNumber, stepType, approvers:[]}] }
// ---------------------------------------------------------------------------
exports.submitPackagingRequest = async (requestId, formData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update form_data and flip status to SUBMITTED
    const { rows } = await client.query(
      `UPDATE tbl_requests
          SET form_data   = $1,
              status      = 'SUBMITTED',
              submitted_at = NOW(),
              updated_at  = NOW()
        WHERE id = $2
        RETURNING *`,
      [JSON.stringify(formData), requestId]
    );
    if (!rows.length) throw new Error('Request not found');

    // 2. Build tbl_approvals rows from workflowSteps
    const steps = (formData.workflowSteps || []);
    if (steps.length === 0) throw new Error('workflowSteps cannot be empty');

    const params = [];
    const vals = [];
    steps.forEach((step, si) => {
      (step.approvers || []).forEach((a, ai) => {
        const base = (si * 10 + ai) * 4;
        params.push(`($${base + 1}, $${base + 2}, 'PENDING', $${base + 3}, $${base + 4})`);
        vals.push(requestId, step.stepNumber, a.emp_uuid, a.name);
      });
    });

    if (params.length === 0) throw new Error('At least one approver is required');

    await client.query(
      `INSERT INTO tbl_approvals
         (request_id, approval_level, decision, assigned_approver_uuid, assigned_approver_name)
       VALUES ${params.join(', ')}
       ON CONFLICT (request_id, approval_level) DO NOTHING`,
      vals
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ---------------------------------------------------------------------------
// 4. List requests — role-aware
//    REQUESTER  → own requests
//    APPROVER   → requests pending their approval
//    ADMIN      → all packaging requests
// ---------------------------------------------------------------------------
const REQUEST_LIST_SELECT = `
  SELECT
    r.id                  AS request_id,
    r.emp_id,
    r.requester_name,
    r.department,
    r.status,
    r.priority,
    r.form_data,
    r.created_at,
    r.updated_at,
    r.submitted_at,
    e.emp_designation,
    e.emp_id              AS emp_code,

    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id',         f.id::text,
          'name',       f.file_name,
          'type',       f.file_type,
          'size',       f.file_size,
          'url',        f.file_url,
          'uploadedAt', f.uploaded_at
        )
      ) FILTER (WHERE f.id IS NOT NULL),
      '[]'
    ) AS files,

    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'approval_level',        a.approval_level,
          'approver_uuid',         a.assigned_approver_uuid,
          'approver_name',         a.assigned_approver_name,
          'decision',              a.decision,
          'remarks',               a.remarks,
          'action_date',           a.action_date
        )
      ) FILTER (WHERE a.request_id IS NOT NULL),
      '[]'
    ) AS approvals,

    (
      SELECT json_build_object(
        'approval_level',   ac.approval_level,
        'approver_uuid',    ac.assigned_approver_uuid,
        'approver_name',    ac.assigned_approver_name,
        'decision',         ac.decision
      )
      FROM tbl_approvals ac
      WHERE ac.request_id = r.id AND ac.decision = 'PENDING'
      ORDER BY ac.approval_level
      LIMIT 1
    ) AS current_req_approval
`;

exports.getPackagingRequestsByRequester = async (empUuid, size) => {
  const pkgTypeId = await getPkgTypeId();
  const limit = toLimit(size);
  const { rows } = await pool.query(
    `${REQUEST_LIST_SELECT}
     FROM tbl_requests r
     JOIN tbl_emp_master e        ON e.emp_uuid  = r.emp_id
     LEFT JOIN tbl_packaging_files f ON f.request_id = r.id
     LEFT JOIN tbl_approvals a    ON a.request_id = r.id
     WHERE r.emp_id = $1 AND r.request_type_id = $2
     GROUP BY r.id, e.emp_designation, e.emp_id
     ORDER BY r.created_at DESC
     ${limit ? 'LIMIT $3' : ''}`,
    limit ? [empUuid, pkgTypeId, limit] : [empUuid, pkgTypeId]
  );
  return rows;
};

exports.getPackagingPendingApprovals = async (empUuid, size) => {
  const pkgTypeId = await getPkgTypeId();
  const limit = toLimit(size);
  const { rows } = await pool.query(
    `${REQUEST_LIST_SELECT}
     FROM tbl_requests r
     JOIN tbl_emp_master e        ON e.emp_uuid  = r.emp_id
     LEFT JOIN tbl_packaging_files f ON f.request_id = r.id
     JOIN tbl_approvals a         ON a.request_id = r.id
     WHERE r.request_type_id = $1
       AND a.assigned_approver_uuid = $2
       AND a.decision = 'PENDING'
     GROUP BY r.id, e.emp_designation, e.emp_id
     ORDER BY r.created_at DESC
     ${limit ? 'LIMIT $3' : ''}`,
    limit ? [pkgTypeId, empUuid, limit] : [pkgTypeId, empUuid]
  );
  return rows;
};

exports.getAllPackagingRequestsAdmin = async (size) => {
  const pkgTypeId = await getPkgTypeId();
  const limit = toLimit(size);
  const { rows } = await pool.query(
    `${REQUEST_LIST_SELECT}
     FROM tbl_requests r
     JOIN tbl_emp_master e        ON e.emp_uuid  = r.emp_id
     LEFT JOIN tbl_packaging_files f ON f.request_id = r.id
     LEFT JOIN tbl_approvals a    ON a.request_id = r.id
     WHERE r.request_type_id = $1
     GROUP BY r.id, e.emp_designation, e.emp_id
     ORDER BY r.created_at DESC
     ${limit ? 'LIMIT $2' : ''}`,
    limit ? [pkgTypeId, limit] : [pkgTypeId]
  );
  return rows;
};

// ---------------------------------------------------------------------------
// 5. Single request detail (includes full file list + all approval levels)
// ---------------------------------------------------------------------------
exports.getPackagingRequestById = async (requestId) => {
  const { rows } = await pool.query(
    `${REQUEST_LIST_SELECT}
     FROM tbl_requests r
     JOIN tbl_emp_master e        ON e.emp_uuid  = r.emp_id
     LEFT JOIN tbl_packaging_files f ON f.request_id = r.id
     LEFT JOIN tbl_approvals a    ON a.request_id = r.id
     WHERE r.id = $1
     GROUP BY r.id, e.emp_designation, e.emp_id`,
    [requestId]
  );
  return rows[0] || null;
};

// ---------------------------------------------------------------------------
// 6. Approve / Reject one level
//    Returns updated request row (for status cascade logic in controller).
// ---------------------------------------------------------------------------
exports.recordApprovalDecision = async (requestId, approvalLevel, decision, remarks, approverUuid) => {
  // Verify approver is assigned to this level
  const { rows: check } = await pool.query(
    `SELECT id FROM tbl_approvals
      WHERE request_id = $1 AND approval_level = $2
        AND assigned_approver_uuid = $3 AND decision = 'PENDING'`,
    [requestId, approvalLevel, approverUuid]
  );
  if (!check.length) return null;   // not authorised or already actioned

  // Record the decision
  await pool.query(
    `UPDATE tbl_approvals
        SET decision    = $1,
            remarks     = $2,
            action_date = NOW()
      WHERE request_id = $3 AND approval_level = $4`,
    [decision, remarks || null, requestId, approvalLevel]
  );

  // Compute new request status
  const newStatus = `L${approvalLevel}_${decision}`;

  // If APPROVED, check whether this was the final level
  if (decision === 'APPROVED') {
    const { rows: remaining } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM tbl_approvals
        WHERE request_id = $1 AND decision = 'PENDING'`,
      [requestId]
    );
    if (Number(remaining[0].cnt) === 0) {
      // All levels approved → final approval
      await pool.query(
        `UPDATE tbl_requests SET status = 'APPROVED', updated_at = NOW() WHERE id = $1`,
        [requestId]
      );
      return { status: 'APPROVED' };
    }
  }

  const { rows } = await pool.query(
    `UPDATE tbl_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [newStatus, requestId]
  );
  return rows[0];
};

// ---------------------------------------------------------------------------
// 7. Audit trail for packaging requests
//    Reads from tbl_audit_logs (existing table used by auditLog util).
// ---------------------------------------------------------------------------
exports.getPackagingAuditTrail = async (requestId) => {
  const pkgTypeId = await getPkgTypeId();
  let query, params;

  if (requestId) {
    query = `
      SELECT al.*, r.id AS request_id, r.requester_name, fd.form_data
      FROM tbl_audit_logs al
      LEFT JOIN tbl_requests r ON r.id::text = al.entity_id
      LEFT JOIN tbl_requests fd ON fd.id = r.id
      WHERE al.entity_type = 'PACKAGING_APPROVAL'
        AND al.entity_id = $1::text
      ORDER BY al.created_at DESC`;
    params = [requestId];
  } else {
    query = `
      SELECT al.*, r.id AS request_id, r.requester_name
      FROM tbl_audit_logs al
      LEFT JOIN tbl_requests r ON r.id::text = al.entity_id AND r.request_type_id = $1
      WHERE al.entity_type = 'PACKAGING_APPROVAL'
      ORDER BY al.created_at DESC
      LIMIT 200`;
    params = [pkgTypeId];
  }

  const { rows } = await pool.query(query, params);
  return rows;
};

// ---------------------------------------------------------------------------
// 8. Packaging approver pool (for SelectApprovers component)
// ---------------------------------------------------------------------------
exports.getPackagingApprovers = async (search) => {
  const { rows } = await pool.query(
    `SELECT id::text, emp_uuid, emp_name, emp_email, emp_designation,
            department, location, phone, role_key
     FROM tbl_packaging_approvers
     WHERE is_active = TRUE
       AND ($1::text IS NULL OR
            emp_name        ILIKE '%' || $1 || '%' OR
            emp_designation ILIKE '%' || $1 || '%' OR
            department      ILIKE '%' || $1 || '%')
     ORDER BY emp_name`,
    [search || null]
  );
  return rows;
};

// ---------------------------------------------------------------------------
// 9. Dashboard stats (filters only PKG-CREATIVE requests)
// ---------------------------------------------------------------------------
exports.getPackagingDashboardStats = async (empUuid, role) => {
  const { rows } = await pool.query(
    `SELECT * FROM fn_packaging_dashboard_stats($1, $2)`,
    [empUuid, role]
  );
  return rows[0] || {
    total_requests: 0, draft: 0, pending: 0,
    in_review: 0, approved: 0, rejected: 0
  };
};

// ---------------------------------------------------------------------------
// 10. Requester info (for email notification after decision)
// ---------------------------------------------------------------------------
exports.getRequesterByEmpUUID = async (empUuid) => {
  const { rows } = await pool.query(
    `SELECT e.emp_name, r.official_email, r.personal_email
     FROM tbl_emp_master e
     JOIN tbl_emp_master_excel r ON r.emp_code = e.emp_id::integer
     WHERE e.emp_uuid = $1`,
    [empUuid]
  );
  return rows[0];
};

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
function toLimit(size) {
  const n = parseInt(size, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}
