const Approval = require('../models/approval.model');
const { auditLog } = require('../utils/audit.util');
const { sendMail } = require('../utils/email.util');
const { createNotification } = require('../utils/notfcation.util');

exports.approve = async (req, res) => {
  const { request_id, decision, remarks, level } = req.body;
  console.log("User Details", req.user.emp_role);
  const userRoles = req.user.emp_role;

  if (!['APPROVED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision' });
  }
  const approvalLevel =
    Number.isInteger(level) && level > 0
      ? `APPROVER`
      : null;
  if (!userRoles.includes(approvalLevel)) {
    console.log("User Role", userRoles + approvalLevel + "Level " + level);
    return res.status(403).json({ error: 'User not authorized for this approval level' });
  }

  const authenticatePerson =
    await Approval.getAuthenticateApprover(req.user.emp_uuid, request_id, level);

  if (!authenticatePerson) {
    return res.status(403).json({ error: 'User is not the assigned approver for this request' });
  }
  await Approval.updateApprovalRequestStatus(
    request_id,
    decision,
    level
  );

  const parsedLevel = parseInt(level, 10);

  const requestStatus =
    ['APPROVED', 'REJECTED'].includes(decision) &&
      !isNaN(parsedLevel) &&
      parsedLevel > 0
      ? `L${parsedLevel}_${decision}`
      : null;


  const requesters = await Approval.updateRequestStatus(
    request_id,
    requestStatus
  );

  console.log("Requesters", requesters);
  const requester = await Approval.getRequesterByEmpUUID(requesters.emp_id);
  const formInfo = await Approval.getFormInforByRequestID(request_id, level);
  const dashboardUrl = `http://10.104.1.24:4200/request/request-list`;
  // Send mail ONLY on approval
  if (decision === 'APPROVED' || decision === 'REJECTED') {
    const toEmail = requester.official_email ? requester.official_email : requester.personal_email;
    await sendMail({
      to: toEmail,
      subject: `Application for ${formInfo.req_name} Form ${decision}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.6;">
      <p>Dear ${requester.emp_name},</p>

      <p>
        Your request for
        <strong>#${formInfo.req_name} (${formInfo.req_doc_code})</strong>
        has been ${decision.toLowerCase()} at level <strong>${level}</strong>.
      </p>

      <p>
        <strong>Approved By:</strong> ${formInfo.assigned_approver_name}
      </p>

      <p>
        <strong>Current Status:</strong> ${requestStatus}
      </p>

      <br />

      <a href="${dashboardUrl}"
         style="
           display: inline-block;
           padding: 10px 18px;
           color: #110072ff;
           text-decoration: none;
           border-radius: 4px;
           font-weight: bold;
         ">
        View Approval Dashboard
      </a>

      <br /><br />

      <p>
        Regards,<br />
        <strong>Japfa Intranet Team</strong>
      </p>

      <p style="font-size: 12px; color: #777;">
        This is an automated notification. Please do not reply.
      </p>
    </div>
      `
    });
  }

  await createNotification({
    recipient_emp_uuid: requesters.emp_id,
    message: `Your request for ${formInfo.req_name} has been ${decision.toLowerCase()} at level ${level}.`,
    link: dashboardUrl
  });

  await auditLog({
    user: {
      emp_uuid: req.user.emp_uuid,
      emp_name: req.user.emp_name,
      emp_role: userRoles
    },
    action: decision + 'FOR REQUEST ID' + request_id,
    entityType: 'FORM APPROVAL',
    entityId: req.user.emp_uuid,
    oldValue: null,
    newValue: null,
    req
  });
  res.json({ success: true });
};

exports.getApprovers = async (department, requestTypeId) => {
  const q = `
    SELECT approval_level, approver_emp_uuid, approver_name
    FROM tbl_department_approvers
    WHERE department = $1
      AND request_type_id = $2
      AND is_active = true
    ORDER BY approval_level
  `;
  const res = await pool.query(q, [department, requestTypeId]);
  return res.rows;
};
