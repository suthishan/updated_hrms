const pool = require('../db/db');
const { normalizeJson } = require('../utils/json.util');
const ApprovalModel = require('./approval.model');

exports.createRequest = async (data) => {
  const query = `
    INSERT INTO tbl_requests
    (request_type_id, emp_id, requester_name, department, priority, form_data, status)
    VALUES ($1,$2,$3,$4,$5, $6, $7)
    RETURNING *;
  `;

  const values = [
    Number(data.request_type_id),
    data.emp_uuid,
    data.requester_name,
    data.department,
    data.priority,
    normalizeJson(data.form_data),
    data.status
  ];

  const result = await pool.query(query, values);


  return result.rows;
};

exports.findActiveDuplicate = async (empId, requestTypeId) => {
  const q = `
    SELECT id, status
    FROM tbl_requests
    WHERE emp_id = $1
      AND request_type_id = $2
    LIMIT 1
  `;
  const res = await pool.query(q, [empId, requestTypeId]);
  return res.rows;
};

exports.createApprovalFlow = async (requestId, department, requestTypeId) => {
  const approvers = await ApprovalModel.getApprovers(
    department,
    requestTypeId
  );

  if (approvers.length === 0) {
    throw new Error(
      `No approvers configured for ${department} Department, Please contact Admin`
    );
  }
  // console.log(approvers);

  const values = [];
  const params = [];

  approvers.forEach((a, idx) => {
    const base = idx * 4;
    params.push(
      `($${base + 1}, $${base + 2}, 'PENDING', $${base + 3}, $${base + 4})`
    );
    values.push(
      requestId,
      a.approval_level,
      a.approver_emp_uuid,
      a.approver_name
    );
  });

  const query = `INSERT INTO tbl_approvals
    (request_id, approval_level, decision,
     assigned_approver_uuid, assigned_approver_name)
    VALUES ${params.join(',')}
    ON CONFLICT (request_id, approval_level) DO NOTHING`;
  // console.log(query);
  await pool.query(query, values);
};

exports.updateFormData = async (requestId, formData, status, currentUser, tag_emp) => {
  const client = await pool.connect(); // Use a client for transaction

  try {
    await client.query('BEGIN'); // Start Transaction

    // 1. Update the main request table
    const updateQuery = `
      UPDATE tbl_requests
      SET form_data = $1,
          status = $2,
          updated_at = NOW(),
          submitted_at = NOW()
      WHERE id = $3
      RETURNING id
    `;

    const updateRes = await client.query(updateQuery, [formData, status, requestId]);

    // 2. Insert into tbl_request_emp_tag if tag_emp array has data
    if (tag_emp && Array.isArray(tag_emp) && tag_emp.length > 0) {
      const insertValues = [];
      const placeholders = [];

      // Loop through the tag_emp array to build placeholders ($1, $2, $3...) and values
      tag_emp.forEach((empId, index) => {
        const offset = index * 3;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);

        insertValues.push(requestId, empId, currentUser);

      });
      const deleteQuery = `
        DELETE FROM tbl_request_emp_tag
        WHERE request_id = $1
      `;
      await client.query(deleteQuery, [requestId]);

      const insertQuery = `
        INSERT INTO tbl_request_emp_tag 
        (request_id, emp_id, tagged_emp_name, tagged_by)
        VALUES ${placeholders.join(', ')}
        ON CONFLICT (request_id, emp_id) DO NOTHING
      `;

      await client.query(insertQuery, insertValues);
    }

    if (status === 'SUBMITTED') {
      const employees = tag_emp
        .map(empId => findemployeeById(empId))
        .filter(emp => emp?.emp_email);

      for (const employee of employees) {
      await sendMail({
            to: toEmail,
            subject: `You Were Mentioned in ${formInfo.req_name} `,
            html: `
              <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.6;">
            <p>Dear ${employee.emp_name},</p>
      
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

        // Wait 1 second between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    await client.query('COMMIT'); // Commit Transaction
    return updateRes.rows.length > 0;

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error("Error in updateFormData:", error);
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
};

exports.findemployeeById = async (empId) => {
  const query = `
    SELECT *
    FROM tbl_emp_master
    WHERE emp_uuid = $1
  `;
  const result = await pool.query(query, [empId]);
  return result.rows[0];
};

exports.getAllRequestsAdmin = async (size) => {
  const parsedSize = Number.parseInt(size, 10);

  const hasLimit = Number.isInteger(parsedSize) && parsedSize > 0;

  const query = `
    SELECT
      r.id AS request_id,
      r.requester_name,
      r.department,
      r.submitted_at,
      r.priority,
      r.status,
      r.created_at,
      e.emp_designation,
      e.emp_id as emp_code,
      rt.rid AS request_type,
      rt.req_name AS request_name,
      json_agg(
        json_build_object(
          'approval_level', a.approval_level,
          'approver_uuid', a.assigned_approver_uuid,
          'approver_name', a.assigned_approver_name,
          'decision', a.decision,
          'remarks', a.remarks,
          'action_date', a.action_date
        )
        ORDER BY a.approval_level
      ) AS approvals,
      next_pending.assigned_to,
      rt.req_name AS form_name
    FROM tbl_requests r
    JOIN tbl_req_master rt ON rt.rid = r.request_type_id
    LEFT JOIN tbl_approvals a ON a.request_id = r.id
    JOIN tbl_emp_master e ON e.emp_uuid = r.emp_id
    LEFT JOIN LATERAL (
      SELECT ap.assigned_approver_name AS assigned_to
      FROM tbl_approvals ap
      WHERE ap.request_id = r.id
        AND ap.decision = 'PENDING'
      ORDER BY ap.approval_level
      LIMIT 1
    ) next_pending ON TRUE
    GROUP BY r.id, rt.rid, next_pending.assigned_to,   e.emp_designation,
      e.emp_id , r.submitted_at
    ORDER BY r.created_at DESC
    ${hasLimit ? 'LIMIT $1' : ''};
  `;

  const result = hasLimit
    ? await pool.query(query, [parsedSize])
    : await pool.query(query);

  return result.rows;
};
exports.getRequestsByRequester = async (empUuid, size) => {
  const query = `
    SELECT
      r.id AS request_id,
      r.emp_id,
       r.submitted_at,
      r.requester_name,
      r.department,
      e.emp_designation,
      e.emp_id as emp_code,
      r.status,
      r.priority,
      r.created_at,
      r.updated_at,
      rt.rid AS request_type,
    rt.req_name AS request_name,
      /* All approvals */
      json_agg(
        json_build_object(
          'approval_level', a_all.approval_level,
          'approver_uuid', a_all.assigned_approver_uuid,
          'approver_name', a_all.assigned_approver_name,
          'decision', a_all.decision,
          'remarks', a_all.remarks,
          'action_date', a_all.action_date
        )
        ORDER BY a_all.approval_level
      ) AS approvals,

      json_agg(
        json_build_object(
          'emp_id', a_tag.emp_id
        )
      ) AS tagged_emps,

      /* CURRENT pending approval (always single row) */
      (
        SELECT json_build_object(
          'approval_level', a_cur.approval_level,
          'approver_uuid', a_cur.assigned_approver_uuid,
          'approver_name', a_cur.assigned_approver_name,
          'decision', a_cur.decision,
          'remarks', a_cur.remarks,
          'action_date', a_cur.action_date
        )
        FROM tbl_approvals a_cur
        WHERE a_cur.request_id = r.id
          AND a_cur.decision = 'PENDING'
        ORDER BY a_cur.approval_level
        LIMIT 1
      ) AS current_req_approval

    FROM tbl_requests r

    /* ONLY for aggregation */
    LEFT JOIN tbl_approvals a_all
      ON a_all.request_id = r.id
    JOIN tbl_request_emp_tag a_tag
      ON a_tag.request_id = r.id  
    JOIN tbl_emp_master e  
      ON e.emp_uuid = r.emp_id
    JOIN tbl_req_master rt
      ON rt.rid = r.request_type_id

    WHERE r.emp_id = $1

    GROUP BY
      r.id,
      r.emp_id,
      r.requester_name,
      r.department,
      r.status,
      r.priority,
      r.created_at,
      r.updated_at,
      rt.rid,
      e.emp_designation,
      e.emp_id,
       r.submitted_at

    ORDER BY r.created_at DESC
    LIMIT $2;
  `;
  const parsedSize = parseInt(size, 10);

  const limit = Number.isInteger(parsedSize) && parsedSize > 0
    ? parsedSize
    : null;
  const result = await pool.query(query, [empUuid, limit]);
  // const result = await pool.query(query, [empUuid]);
  return result.rows;
};

exports.getL1PendingRequests = async (empUuid, size) => {
  const query = `
    SELECT
      r.id AS request_id,
      r.emp_id,
       r.submitted_at,
      r.requester_name,
      r.department,
      r.status,
      e.emp_designation,
      e.emp_id as emp_code,
      r.priority,
      r.created_at,
      r.updated_at,
      rt.rid AS request_type,
      rt.req_name AS request_name,

      json_agg(
        json_build_object(
          'approval_level', a_all.approval_level,
          'approver_uuid', a_all.assigned_approver_uuid,
          'approver_name', a_all.assigned_approver_name,
          'decision', a_all.decision,
          'remarks', a_all.remarks,
          'action_date', a_all.action_date
        )
        ORDER BY a_all.approval_level
      ) AS approvals,

      (
        SELECT json_build_object(
          'approval_level', a_cur.approval_level,
          'approver_uuid', a_cur.assigned_approver_uuid,
          'approver_name', a_cur.assigned_approver_name,
          'decision', a_cur.decision,
          'remarks', a_cur.remarks,
          'action_date', a_cur.action_date
        )
        FROM tbl_approvals a_cur
        WHERE a_cur.request_id = r.id
          AND a_cur.decision = 'PENDING'
        ORDER BY a_cur.approval_level
        LIMIT 1
      ) AS current_req_approval

    FROM tbl_requests r
    JOIN tbl_approvals a_filter
      ON a_filter.request_id = r.id
    JOIN tbl_approvals a_all
      ON a_all.request_id = r.id
    JOIN tbl_emp_master e  
      ON e.emp_uuid = r.emp_id      
    JOIN tbl_req_master rt
      ON rt.rid = r.request_type_id

    WHERE a_filter.assigned_approver_uuid = $1
      AND r.status = 'SUBMITTED'
      AND a_filter.approval_level = 1
      AND a_filter.decision = 'PENDING'

    GROUP BY r.id, rt.rid,e.emp_designation,
      e.emp_id,  r.submitted_at
    ORDER BY r.created_at DESC
    LIMIT $2;
  `;

  const parsedSize = parseInt(size, 10);

  const limit = Number.isInteger(parsedSize) && parsedSize > 0
    ? parsedSize
    : null;
  const result = await pool.query(query, [empUuid, limit]);
  // const result = await pool.query(query, [empUuid]);
  return result.rows;
};



exports.getL2PendingRequests = async (empUuid, size) => {
  const query = `
    SELECT
      r.id AS request_id,
      r.emp_id,
       r.submitted_at,
      r.requester_name,
      e.emp_designation,
      e.emp_id as emp_code,
      r.department,
      r.status,
      r.priority,
      r.created_at,
      r.updated_at,
      rt.rid AS request_type,
      rt.req_name AS request_name,

      -- all approval levels
      json_agg(
        json_build_object(
          'approval_level', a_all.approval_level,
          'approver_uuid', a_all.assigned_approver_uuid,
          'approver_name', a_all.assigned_approver_name,
          'decision', a_all.decision,
          'remarks', a_all.remarks,
          'action_date', a_all.action_date
        )
        ORDER BY a_all.approval_level
      ) AS approvals,

      -- current approver (first pending)
      (
        SELECT json_build_object(
          'approval_level', a_cur.approval_level,
          'approver_uuid', a_cur.assigned_approver_uuid,
          'approver_name', a_cur.assigned_approver_name,
          'decision', a_cur.decision,
          'remarks', a_cur.remarks,
          'action_date', a_cur.action_date
        )
        FROM tbl_approvals a_cur
        WHERE a_cur.request_id = r.id
          AND a_cur.decision = 'PENDING'
        ORDER BY a_cur.approval_level
        LIMIT 1
      ) AS current_req_approval

    FROM tbl_requests r
    JOIN tbl_req_master rt
      ON rt.rid = r.request_type_id

    -- filter: L2 must be this user & pending
    JOIN tbl_approvals a_filter_l2
      ON a_filter_l2.request_id = r.id
     AND a_filter_l2.decision = 'PENDING'


    JOIN tbl_emp_master e  
      ON e.emp_uuid = r.emp_id     
    -- collect all approvals
    JOIN tbl_approvals a_all
      ON a_all.request_id = r.id

    WHERE a_filter_l2.assigned_approver_uuid = $1
      AND (r.status = 'L1_APPROVED' OR r.status = 'L2_APPROVED' OR r.status = 'L3_APPROVED' OR r.status ='SUBMITTED')

    GROUP BY r.id, rt.rid,    e.emp_designation,
      e.emp_id, r.submitted_at
    ORDER BY r.created_at DESC
     LIMIT $2;
  `;

  const parsedSize = parseInt(size, 10);

  const limit = Number.isInteger(parsedSize) && parsedSize > 0
    ? parsedSize
    : null;
  const result = await pool.query(query, [empUuid, limit]);
  // const result = await pool.query(query, [empUuid]);
  return result.rows;
};


exports.getRequestById = async (id) => {
  const query = `
    SELECT
      r.id AS request_id,
      r.emp_id,
      r.submitted_at,
      r.requester_name,
      r.department,
      r.status,
      r.priority,
      r.form_data,
      r.created_at,
      r.updated_at,

      rt.rid AS request_type,
      rt.req_name AS request_name,

      e.emp_name,
      e.emp_id AS emp_code,
      e.emp_designation,

      /* ===========================
         ALL APPROVAL HISTORY
      =========================== */
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'approval_level', a_all.approval_level,
            'approver_uuid', a_all.assigned_approver_uuid,
            'approver_name', a_all.assigned_approver_name,
            'decision', a_all.decision,
            'remarks', a_all.remarks,
            'action_date', a_all.action_date
          )
        ) FILTER (WHERE a_all.request_id IS NOT NULL),
        '[]'
      ) AS approvals,
      /* ===========================
         CURRENT PENDING APPROVAL
      =========================== */
      (
        SELECT json_build_object(
          'approval_level', a_cur.approval_level,
          'approver_uuid', a_cur.assigned_approver_uuid,
          'approver_name', a_cur.assigned_approver_name,
          'decision', a_cur.decision,
          'remarks', a_cur.remarks,
          'action_date', a_cur.action_date
        )
        FROM tbl_approvals a_cur
        WHERE a_cur.request_id = r.id
          AND a_cur.decision = 'PENDING'
        ORDER BY a_cur.approval_level
        LIMIT 1
      ) AS current_req_approval

    FROM tbl_requests r

    JOIN tbl_req_master rt
      ON rt.rid = r.request_type_id

    JOIN tbl_emp_master e
      ON e.emp_uuid = r.emp_id

    /* All approvals */
    LEFT JOIN tbl_approvals a_all
      ON a_all.request_id = r.id

    WHERE r.id = $1

    GROUP BY
      r.id,
      rt.rid,
      rt.req_name,
      e.emp_name,
      e.emp_id,
      e.emp_designation

    ORDER BY r.created_at DESC;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

exports.fetchDashboardOverview = async (empUuid, role) => {
  let query = '';
  let params = [];

  switch (role) {

    /* ============================================================
       REQUESTER DASHBOARD
    ============================================================ */
    case 'REQUESTER':
      query = `
        SELECT
          COUNT(*) FILTER (WHERE r.status != 'DRAFT')      AS total_request,
          COUNT(*) FILTER (WHERE r.status = 'SUBMITTED')   AS l1_pending,
          COUNT(*) FILTER (WHERE r.status = 'L1_APPROVED') AS l2_pending,
          COUNT(*) FILTER (WHERE r.status = 'L1_REJECTED') AS l1_rejected,
          COUNT(*) FILTER (WHERE r.status = 'L2_REJECTED') AS l2_rejected,
          COUNT(*) FILTER (WHERE r.status = 'L2_APPROVED') AS final_approved,
          COUNT(*) FILTER (WHERE r.status = 'DRAFT')       AS draft_request,

          (
            SELECT json_agg(
              json_build_object(
                'department', department,
                'department_total_req', dept_count
              )
              ORDER BY department
            )
            FROM (
              SELECT department, COUNT(*) AS dept_count
              FROM tbl_requests
              WHERE emp_id = $1
              GROUP BY department
            ) dept
          ) AS department_summary

        FROM tbl_requests r
        WHERE r.emp_id = $1
      `;
      params = [empUuid];
      break;


    /* ============================================================
       LEVEL 1 APPROVER DASHBOARD
    ============================================================ */
    case 'APPROVER':
      query = `
        SELECT
          COUNT(*)                                   AS total_assigned_requests,
          COUNT(*) FILTER (WHERE a.decision = 'PENDING')  AS pending,
          COUNT(*) FILTER (WHERE a.decision = 'APPROVED') AS approved_by_me,
          COUNT(*) FILTER (WHERE a.decision = 'REJECTED') AS rejected_by_me,

          (
            SELECT json_agg(
              json_build_object(
                'department', department,
                'department_total_req', dept_count
              )
              ORDER BY department
            )
            FROM (
              SELECT r.department, COUNT(*) AS dept_count
              FROM tbl_requests r
              JOIN tbl_approvals a2 
                ON r.id = a2.request_id
              WHERE a2.assigned_approver_uuid = $1
              GROUP BY r.department
            ) dept
          ) AS department_summary

        FROM tbl_approvals a
        WHERE a.assigned_approver_uuid = $1
      `;
      params = [empUuid];
      break;
    /* ============================================================
       ADMIN DASHBOARD
    ============================================================ */
    case 'ADMIN':
      query = `
        SELECT
          COUNT(*) FILTER (WHERE r.status != 'DRAFT')      AS total_request,
          COUNT(*) FILTER (WHERE r.status = 'SUBMITTED')   AS l1_pending,
          COUNT(*) FILTER (WHERE r.status = 'L1_APPROVED') AS l2_pending,
          COUNT(*) FILTER (WHERE r.status = 'L2_APPROVED') AS final_approved,
          COUNT(*) FILTER (WHERE r.status LIKE '%REJECTED') AS rejected,

          (
            SELECT json_agg(
              json_build_object(
                'department', department,
                'department_total_req', dept_count
              )
              ORDER BY department
            )
            FROM (
              SELECT department, COUNT(*) AS dept_count
              FROM tbl_requests
              GROUP BY department
            ) dept
          ) AS department_summary

        FROM tbl_requests r
      `;
      params = [];
      break;

    default:
      throw new Error('Invalid role for dashboard overview');
  }

  const { rows } = await pool.query(query, params);
  return rows[0] || {};
};

exports.getApproverHistory = async (empUuid) => {
  const query = `
    SELECT a.*, r.id AS request_id, r.request_type_id, rt.req_name AS request_type_name, e.emp_name, r.submitted_at, r.updated_at AS request_updated_at
    FROM tbl_approvals a
    JOIN tbl_requests r ON r.id = a.request_id
    JOIN tbl_req_master rt ON rt.rid = r.request_type_id
    JOIN tbl_emp_master e ON e.emp_uuid = r.emp_id
    WHERE a.assigned_approver_uuid = $1
      AND a.decision != 'PENDING'
      `;
  const result = await pool.query(query, [empUuid]);
  return result.rows;
}


exports.fetchRequestNotifications = async (empUuid) => {
  const query = `
    SELECT
      r.id              AS request_id,
      r.requester_name,
      r.department,
      r.status,
      r.priority,
      r.created_at,
      r.updated_at,
      r.submitted_at,
      rt.req_name       AS request_name,
      a.approval_level
    FROM tbl_requests r
    INNER JOIN tbl_req_master rt
      ON rt.rid = r.request_type_id
    INNER JOIN tbl_approvals a
      ON a.request_id = r.id
    WHERE a.assigned_approver_uuid = $1
      AND a.decision = 'PENDING'
      AND (
           (a.approval_level = 1 AND r.status = 'SUBMITTED')
        OR (a.approval_level = 2 AND r.status = 'L1_APPROVED')
      )
    ORDER BY r.created_at DESC
  `;

  const { rows } = await pool.query(query, [empUuid]);
  return rows;
};


exports.getRequestTypeById = async (requestTypeId) => {
  const query = `
    SELECT *
    FROM tbl_req_master
    WHERE rid = $1
  `;
  const result = await pool.query(query, [requestTypeId]);
  return result.rows[0];
};


exports.fetchTaggedRequests = async (empUuid) => {
  const query = `
    SELECT
      r.id AS request_id,
      r.requester_name,
      r.department,
      r.status,
      r.priority,
      r.created_at,
      r.updated_at,
      r.submitted_at,
      r.form_data,
      r.requester_name as tagged_by,
      rt.req_name AS request_name
    FROM tbl_requests r
    INNER JOIN tbl_req_master rt
      ON rt.rid = r.request_type_id
    INNER JOIN tbl_approvals a
      ON a.request_id = r.id
    WHERE a.tagged_emp_uuid = $1
    ORDER BY r.created_at DESC
  `;
  const result = await pool.query(query, [empUuid]);
  return result.rows;
};