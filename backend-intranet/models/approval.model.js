const pool = require('../db/db');

exports.addApproval = async (data) => {
  const q = `
    INSERT INTO tbl_audit_logs
    (request_id, approval_level, approver_name, decision, remarks, action_date)
    VALUES ($1,$2,$3,$4,$5,NOW())
  `;
  await pool.query(q, [
    data.request_id,
    data.level,
    data.approver_name,
    data.decision,
    data.remarks
  ]);
};

exports.getAuthenticateApprover =  async(emp_id, req_id, approvalLevel) => {
  const q = `SELECT * FROM tbl_approvals WHERE assigned_approver_uuid = $1 AND request_id = $2 AND approval_level = $3 `;
  const res = await pool.query(q, [emp_id, req_id, approvalLevel]);
  return res.rows[0];
}

exports.updateApprovalRequestStatus = async (id, status, level) => {
  console.log("Id"+id+ " Status "+ status + " level "+ level)
  const result = await pool.query(
    `UPDATE tbl_approvals 
     SET decision = $2
     WHERE request_id = $1 AND approval_level = $3
     RETURNING request_id, decision`,
    [id, status, level]
  );
  return result;
};

exports.updateRequestStatus = async (id, status) => {
  const { rows } = await pool.query(
    `UPDATE tbl_requests
     SET status = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status]
  );

  return rows[0];
};


exports.getRequestWithApprovals = async (requestId) => {
  const q = `
    SELECT
      r.*,
      json_agg(
        json_build_object(
          'level', a.approval_level,
          'decision', a.decision,
          'approver_id', a.approver_id,
          'remarks', a.remarks,
          'action_date', a.action_date
        )
      ) AS approvals
    FROM tbl_requests r
    LEFT JOIN tbl_approvals a ON a.request_id = r.id
    WHERE r.id = $1
    GROUP BY r.id
  `;
  const res = await pool.query(q, [requestId]);
  return res.rows[0];
};


exports.approveRequest = async (req, res) => {
  const { request_id, decision, remarks } = req.body;
  const approverUuid = req.user.emp_uuid;

  const q = `
    UPDATE tbl_approvals
    SET decision = $1,
        remarks = $2,
        action_date = NOW()
    WHERE request_id = $3
      AND assigned_approver_uuid = $4
      AND decision = 'PENDING'
    RETURNING id
  `;

  const result = await pool.query(q, [
    decision, remarks, request_id, approverUuid
  ]);

  if (result.rows.length === 0) {
  return res.status(403).j4son({
      sts: "0",
      message: "You are not authorized to approve this request"
    });
  }

  res.json({
    sts: "1",
    message: "Approval updated"
  });
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
  // console.log(q);
  
  const res = await pool.query(q, [department, requestTypeId]);
  return res.rows;
};


exports.createApprovalFlow = async (requestId, department) => {
  const approvers = await pool.query(`
    SELECT level, approver_emp_uuid
    FROM tbl_approval_matrix
    WHERE department = $1
    ORDER BY level
  `, [department]);

  for (const row of approvers.rows) {
    await pool.query(`
      INSERT INTO tbl_approvals
      (request_id, level, approver_emp_uuid, status)
      VALUES ($1,$2,$3,'PENDING')
    `, [requestId, row.level, row.approver_emp_uuid]);
  }
};

exports.getRequesterByEmpUUID = async (emp_uuid) => {
  console.log('Fetching requester details for emp_uuid:', emp_uuid);

  const query = `
    SELECT 
      r.official_email,
      r.personal_email,
      e.emp_name
    FROM tbl_emp_master e
    JOIN tbl_emp_master_excel r
      ON r.emp_code = e.emp_id::integer
    WHERE e.emp_uuid = $1
  `;

  const { rows } = await pool.query(query, [emp_uuid]);
  return rows[0];
};


exports.getFormInforByRequestID = async (request_id, level) => {
  console.log('Fetching form info for request_id:', request_id);

  const query = `
    SELECT 
      r.req_name,
      r.req_doc_code,
      a.requester_name,
      b.assigned_approver_name
    FROM tbl_requests a
    JOIN tbl_req_master r
      ON r.rid = a.request_type_id
    JOIN tbl_approvals b
      ON b.request_id = a.id AND b.approval_level = $2
    WHERE a.id = $1
  `;

  const { rows } = await pool.query(query, [request_id, level]);
  return rows[0];
};





