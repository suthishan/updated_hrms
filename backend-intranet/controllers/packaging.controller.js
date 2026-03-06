/**
 * Packaging Creative Approval — HTTP Controller
 * Follows the same pattern as request.controller.js / approval.controller.js
 *
 * Response envelope: { sts: "1"|"0", message: "...", result: ... }
 */
const PackagingModel = require('../models/packaging.model');
const { auditLog }          = require('../utils/audit.util');
const { sendMail }          = require('../utils/email.util');
const { createNotification } = require('../utils/notfcation.util');

const DASHBOARD_URL = 'http://10.104.1.24:4200/pages/packaging/inbox';

// ---------------------------------------------------------------------------
// POST /api/packaging/create-draft
// Body: { emp_uuid, requester_name, department, priority }
// Creates a DRAFT request and returns its id.
// ---------------------------------------------------------------------------
exports.createDraft = async (req, res) => {
  try {
    const { emp_uuid, requester_name, department, priority } = req.body;
    if (!emp_uuid || !requester_name || !department) {
      return res.status(400).json({
        sts: '0',
        message: 'emp_uuid, requester_name and department are required'
      });
    }
    const row = await PackagingModel.createPackagingDraft({
      empUuid: emp_uuid,
      requesterName: requester_name,
      department,
      priority
    });
    await auditLog({
      user: { emp_uuid: req.user.emp_uuid, emp_name: req.user.emp_name, emp_role: req.user.emp_role },
      action: 'PACKAGING_DRAFT_CREATED',
      entityType: 'PACKAGING_APPROVAL',
      entityId: row.id,
      oldValue: null,
      newValue: null,
      req
    });
    return res.json({ sts: '1', message: 'Draft created', result: row });
  } catch (err) {
    console.error('[packaging] createDraft', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /api/packaging/upload-files   (multipart/form-data)
// Field: request_id (int), files: [] (via multer .array('files', 10))
// ---------------------------------------------------------------------------
exports.uploadFiles = async (req, res) => {
  try {
    const { request_id } = req.body;
    if (!request_id) {
      return res.status(400).json({ sts: '0', message: 'request_id is required' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ sts: '0', message: 'No files uploaded' });
    }
    const rows = await PackagingModel.addPackagingFiles(Number(request_id), req.files);
    return res.json({ sts: '1', message: 'Files saved', result: rows });
  } catch (err) {
    console.error('[packaging] uploadFiles', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /api/packaging/submit
// Body: { request_id, form_data: { title, productName, productCategory,
//          batchRef, description, workflowType,
//          workflowSteps: [{stepNumber, stepType, approvers:[{emp_uuid,name}]}] } }
// Saves metadata, creates approval rows, flips status to SUBMITTED.
// ---------------------------------------------------------------------------
exports.submitRequest = async (req, res) => {
  try {
    const { request_id, form_data } = req.body;
    if (!request_id || !form_data) {
      return res.status(400).json({ sts: '0', message: 'request_id and form_data are required' });
    }
    const row = await PackagingModel.submitPackagingRequest(Number(request_id), form_data);
    await auditLog({
      user: { emp_uuid: req.user.emp_uuid, emp_name: req.user.emp_name, emp_role: req.user.emp_role },
      action: 'PACKAGING_REQUEST_SUBMITTED',
      entityType: 'PACKAGING_APPROVAL',
      entityId: request_id,
      oldValue: null,
      newValue: JSON.stringify(form_data),
      req
    });
    // Notify L1 approver
    const firstStep = (form_data.workflowSteps || [])[0];
    if (firstStep && firstStep.approvers && firstStep.approvers.length > 0) {
      for (const approver of firstStep.approvers) {
        if (approver.email) {
          await sendMail({
            to: approver.email,
            subject: `Action Required: Packaging Creative Approval — ${form_data.title}`,
            html: _buildApproverNotificationHtml({
              approverName: approver.name,
              title: form_data.title,
              requesterName: req.user.emp_name,
              level: 1,
              dashboardUrl: DASHBOARD_URL
            })
          });
        }
      }
    }
    return res.json({ sts: '1', message: 'Request submitted for approval', result: row });
  } catch (err) {
    console.error('[packaging] submitRequest', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /api/packaging/get-requests
// Body: { emp_uuid, emp_role: 'REQUESTER'|'APPROVER'|'ADMIN', size? }
// Returns list of packaging requests appropriate to the caller's role.
// ---------------------------------------------------------------------------
exports.getRequests = async (req, res) => {
  try {
    const { emp_uuid, emp_role, size } = req.body;
    let result;
    switch (emp_role) {
      case 'REQUESTER':
        result = await PackagingModel.getPackagingRequestsByRequester(emp_uuid, size);
        break;
      case 'APPROVER':
        result = await PackagingModel.getPackagingPendingApprovals(emp_uuid, size);
        break;
      case 'ADMIN':
        result = await PackagingModel.getAllPackagingRequestsAdmin(size);
        break;
      default:
        return res.status(403).json({ sts: '0', message: 'Invalid role' });
    }
    return res.json({ sts: '1', message: 'Requests fetched', result, total: result.length });
  } catch (err) {
    console.error('[packaging] getRequests', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /api/packaging/get-request-by-id
// Body: { request_id }
// ---------------------------------------------------------------------------
exports.getRequestById = async (req, res) => {
  try {
    const { request_id } = req.body;
    if (!request_id) {
      return res.status(400).json({ sts: '0', message: 'request_id is required' });
    }
    const row = await PackagingModel.getPackagingRequestById(Number(request_id));
    if (!row) return res.status(404).json({ sts: '0', message: 'Request not found' });
    return res.json({ sts: '1', message: 'Request detail fetched', result: row });
  } catch (err) {
    console.error('[packaging] getRequestById', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /api/packaging/approve
// Body: { request_id, level, decision: 'APPROVED'|'REJECTED', remarks }
// Auth: requires APPROVER role (enforced by middleware in routes)
// ---------------------------------------------------------------------------
exports.approve = async (req, res) => {
  try {
    const { request_id, level, decision, remarks } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ sts: '0', message: 'decision must be APPROVED or REJECTED' });
    }
    if (!level || !request_id) {
      return res.status(400).json({ sts: '0', message: 'request_id and level are required' });
    }

    const updated = await PackagingModel.recordApprovalDecision(
      Number(request_id),
      Number(level),
      decision,
      remarks,
      req.user.emp_uuid
    );

    if (!updated) {
      return res.status(403).json({
        sts: '0',
        message: 'Not authorised for this request/level or already actioned'
      });
    }

    await auditLog({
      user: { emp_uuid: req.user.emp_uuid, emp_name: req.user.emp_name, emp_role: req.user.emp_role },
      action: `PACKAGING_${decision}_L${level}`,
      entityType: 'PACKAGING_APPROVAL',
      entityId: request_id,
      oldValue: null,
      newValue: JSON.stringify({ decision, level, remarks }),
      req
    });

    // Fetch full request to get requester details + form title
    const full = await PackagingModel.getPackagingRequestById(Number(request_id));
    const formData = full ? (full.form_data || {}) : {};
    const title = formData.title || `Request #${request_id}`;

    // Notify requester
    if (full && full.emp_id) {
      const requester = await PackagingModel.getRequesterByEmpUUID(full.emp_id);
      if (requester) {
        const toEmail = requester.official_email || requester.personal_email;
        if (toEmail) {
          await sendMail({
            to: toEmail,
            subject: `Packaging Creative ${decision === 'APPROVED' ? 'Approved' : 'Rejected'} at Level ${level} — ${title}`,
            html: _buildRequesterNotificationHtml({
              requesterName: requester.emp_name,
              title,
              decision,
              level,
              approverName: req.user.emp_name,
              remarks,
              dashboardUrl: DASHBOARD_URL
            })
          });
        }
        await createNotification({
          recipient_emp_uuid: full.emp_id,
          message: `Your packaging creative "${title}" was ${decision.toLowerCase()} at level ${level}.`,
          link: DASHBOARD_URL
        });
      }
    }

    return res.json({ sts: '1', message: `Request ${decision.toLowerCase()} successfully`, result: updated });
  } catch (err) {
    console.error('[packaging] approve', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// GET /api/packaging/audit-trail?request_id=123
// ---------------------------------------------------------------------------
exports.getAuditTrail = async (req, res) => {
  try {
    const requestId = req.query.request_id ? Number(req.query.request_id) : null;
    const rows = await PackagingModel.getPackagingAuditTrail(requestId);
    return res.json({ sts: '1', message: 'Audit trail fetched', result: rows, total: rows.length });
  } catch (err) {
    console.error('[packaging] getAuditTrail', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// GET /api/packaging/approvers?search=Raj
// ---------------------------------------------------------------------------
exports.getApprovers = async (req, res) => {
  try {
    const rows = await PackagingModel.getPackagingApprovers(req.query.search);
    return res.json({ sts: '1', message: 'Approvers fetched', result: rows, total: rows.length });
  } catch (err) {
    console.error('[packaging] getApprovers', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /api/packaging/dashboard-stats
// Body: { emp_uuid, emp_role }
// ---------------------------------------------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const { emp_uuid, emp_role } = req.body;
    const stats = await PackagingModel.getPackagingDashboardStats(emp_uuid, emp_role || 'REQUESTER');
    return res.json({ sts: '1', message: 'Dashboard stats fetched', result: stats });
  } catch (err) {
    console.error('[packaging] getDashboardStats', err);
    return res.status(500).json({ sts: '0', message: err.message });
  }
};

// ---------------------------------------------------------------------------
// Private email template helpers
// ---------------------------------------------------------------------------
function _buildApproverNotificationHtml({ approverName, title, requesterName, level, dashboardUrl }) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6">
      <p>Dear ${approverName},</p>
      <p>A packaging creative requires your approval at <strong>Level ${level}</strong>.</p>
      <table style="border-collapse:collapse;margin:12px 0">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Document</td><td>${title}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Requested by</td><td>${requesterName}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Level</td><td>${level}</td></tr>
      </table>
      <a href="${dashboardUrl}" style="display:inline-block;padding:10px 18px;background:#110072;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">
        Review Now
      </a>
      <p style="margin-top:20px">Regards,<br><strong>Japfa Intranet Team</strong></p>
      <p style="font-size:12px;color:#777">This is an automated notification. Please do not reply.</p>
    </div>`;
}

function _buildRequesterNotificationHtml({ requesterName, title, decision, level, approverName, remarks, dashboardUrl }) {
  const verb = decision === 'APPROVED' ? 'approved' : 'rejected';
  const color = decision === 'APPROVED' ? '#28a745' : '#dc3545';
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6">
      <p>Dear ${requesterName},</p>
      <p>Your packaging creative has been <strong style="color:${color}">${verb}</strong> at Level ${level}.</p>
      <table style="border-collapse:collapse;margin:12px 0">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Document</td><td>${title}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Actioned by</td><td>${approverName}</td></tr>
        ${remarks ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Remarks</td><td>${remarks}</td></tr>` : ''}
      </table>
      <a href="${dashboardUrl}" style="display:inline-block;padding:10px 18px;background:#110072;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">
        View Dashboard
      </a>
      <p style="margin-top:20px">Regards,<br><strong>Japfa Intranet Team</strong></p>
      <p style="font-size:12px;color:#777">This is an automated notification. Please do not reply.</p>
    </div>`;
}
