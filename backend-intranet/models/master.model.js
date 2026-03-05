const pool = require('../db/db');

exports.getEmployees = async (emp_name) => {
  const { rows } = await pool.query(
    `
      SELECT *
      FROM tbl_emp_master
      WHERE emp_status = 'active'
        AND emp_name ILIKE $1
      ORDER BY emp_name
    `,
    [`%${emp_name}%`]
  );

  return rows;
};


exports.getRequestTypes = async () => {
  const { rows } = await pool.query(
    `SELECT * 
     FROM tbl_req_master 
     WHERE req_status = 'active' 
     ORDER BY req_name`
  );
  return rows;
};

exports.createReqMaster = async (reqData) => {
  const {
    req_name,
    req_description,
    req_status,
    req_doc_code,
    req_rev_sts,
    issue_date,
    is_required_approver_flow,
    is_required_to_tag_emp,
    is_required_approver_remark
  } = reqData;

  const query = `
    INSERT INTO tbl_req_master (
      req_name,
      req_description,
      req_status,
      req_doc_code,
      req_rev_sts,
      issue_date,
      is_required_approver_flow,
      is_required_to_tag_emp,
      is_required_approver_remark
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING rid;
  `;

  const values = [
    req_name,
    req_description,
    req_status,
    req_doc_code,
    req_rev_sts,
    issue_date,
    is_required_approver_flow ?? false,
    is_required_to_tag_emp ?? false,
    is_required_approver_remark ?? false
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.updateReqMaster = async (rid, reqData) => {
  const {
    req_name,
    req_description,
    req_status,
    req_doc_code,
    req_rev_sts,
    issue_date,
    is_required_approver_flow,
    is_required_to_tag_emp,
    is_required_approver_remark
  } = reqData;

  const query = `
    UPDATE tbl_req_master
    SET
      req_name = $1,
      req_description = $2,
      req_status = $3,
      req_doc_code = $4,
      req_rev_sts = $5,
      issue_date = $6,
      is_required_approver_flow = $7,
      is_required_to_tag_emp = $8,
      is_required_approver_remark = $9
    WHERE rid = $10
    RETURNING rid;
  `;

  const values = [
    req_name,
    req_description,
    req_status,
    req_doc_code,
    req_rev_sts,
    issue_date,
    is_required_approver_flow,
    is_required_to_tag_emp,
    is_required_approver_remark,
    rid
  ];

  const { rowCount, rows } = await pool.query(query, values);

  if (rowCount === 0) {
    throw new Error("Request Master not found");
  }

  return rows[0];
};

exports.assignMultiLevelApprovers = async (request_type_id, reqData) => {
  const { department, approvals } = reqData;

  if (!Array.isArray(approvals) || approvals.length === 0) {
    throw new Error("Approval configuration is required");
  }

  const approverValues = [];
  const approverPlaceholders = [];

  const roleValues = [];
  const rolePlaceholders = [];

  let idx1 = 1;
  let idx2 = 1;

  const seen = new Set();
  const MAX_APPROVAL_LEVEL = 6;

  approvals.forEach(level => {
    const { approval_level, approvers } = level;

    if (!Array.isArray(approvers) || approvers.length === 0) {
      throw new Error(`Approvers missing for level ${approval_level}`);
    }

    if (
      !Number.isInteger(approval_level) ||
      approval_level <= 0 ||
      approval_level > MAX_APPROVAL_LEVEL
    ) {
      throw new Error(`Invalid approval level: ${approval_level}`);
    }

    const role = `APPROVER_L${approval_level}`;

    approvers.forEach(approver => {
      const key = `${department}|${request_type_id}|${approval_level}|${approver.approver_emp_uuid}`;
      if (seen.has(key)) return; // deduplicate within payload
      seen.add(key);

      approverPlaceholders.push(
        `($${idx1++}, $${idx1++}, $${idx1++}, $${idx1++}, $${idx1++}, true)`
      );
      approverValues.push(
        department,
        request_type_id,
        approval_level,
        approver.approver_emp_uuid,
        approver.approver_name
      );

      rolePlaceholders.push(`($${idx2++}, $${idx2++})`);
      roleValues.push(approver.approver_emp_uuid, role);
    });
  });

  if (approverPlaceholders.length === 0) {
    throw new Error("No valid approvers to insert after deduplication");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ======================================
       1️⃣ DELETE existing rows for this
          department + request_type_id combo
          (cleans up stale active/inactive rows)
    ====================================== */
    await client.query(
      `
      DELETE FROM tbl_department_approvers
      WHERE request_type_id = $1
        AND department = $2
      `,
      [request_type_id, department]
    );

    /* ======================================
       2️⃣ Insert fresh approvers
    ====================================== */
    await client.query(
      `
      INSERT INTO tbl_department_approvers (
        department,
        request_type_id,
        approval_level,
        approver_emp_uuid,
        approver_name,
        is_active
      )
      VALUES ${approverPlaceholders.join(", ")}
      `,
      approverValues
    );

    /* ======================================
       3️⃣ Insert roles safely
    ====================================== */
    await client.query(
      `
      INSERT INTO tbl_employee_role (employee_id, role)
      VALUES ${rolePlaceholders.join(", ")}
      ON CONFLICT (employee_id, role) DO NOTHING
      `,
      roleValues
    );

    await client.query("COMMIT");
    return { message: "Approvers and roles assigned successfully" };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.updateMultiLevelApprovers = async (request_type_id, reqData) => {
  const { department, approvals } = reqData;

  if (!Array.isArray(approvals) || approvals.length === 0) {
    throw new Error("Approval configuration is required");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ======================================
       1️⃣ Deactivate ALL existing rows first
          (both true and any stale false rows 
           — just delete them cleanly)
    ====================================== */
    await client.query(
      `
      DELETE FROM tbl_department_approvers
      WHERE request_type_id = $1
        AND department = $2
      `,
      [request_type_id, department]
    );

    /* ======================================
       2️⃣ Build & deduplicate insert data
    ====================================== */
    const approverValues = [];
    const approverPlaceholders = [];

    const roleValues = [];
    const rolePlaceholders = [];

    let idx1 = 1;
    let idx2 = 1;

    const seen = new Set();
    const MAX_APPROVAL_LEVEL = 6;

    approvals.forEach(level => {
      const { approval_level, approvers } = level;

      if (!Array.isArray(approvers) || approvers.length === 0) {
        throw new Error(`Approvers missing for level ${approval_level}`);
      }

      if (
        !Number.isInteger(approval_level) ||
        approval_level <= 0 ||
        approval_level > MAX_APPROVAL_LEVEL
      ) {
        throw new Error(`Invalid approval level: ${approval_level}`);
      }

      const role = `APPROVER_L${approval_level}`;

      approvers.forEach(approver => {
        const key = `${department}|${request_type_id}|${approval_level}|${approver.approver_emp_uuid}`;
        if (seen.has(key)) return;
        seen.add(key);

        approverPlaceholders.push(
          `($${idx1++}, $${idx1++}, $${idx1++}, $${idx1++}, $${idx1++}, true)`
        );
        approverValues.push(
          department,
          request_type_id,
          approval_level,
          approver.approver_emp_uuid,
          approver.approver_name
        );

        rolePlaceholders.push(`($${idx2++}, $${idx2++})`);
        roleValues.push(approver.approver_emp_uuid, role);
      });
    });

    if (approverPlaceholders.length === 0) {
      throw new Error("No valid approvers to insert after deduplication");
    }

    /* ======================================
       3️⃣ Insert fresh rows
    ====================================== */
    await client.query(
      `
      INSERT INTO tbl_department_approvers (
        department,
        request_type_id,
        approval_level,
        approver_emp_uuid,
        approver_name,
        is_active
      )
      VALUES ${approverPlaceholders.join(", ")}
      `,
      approverValues
    );

    /* Insert roles safely */
    if (rolePlaceholders.length > 0) {
      await client.query(
        `
        INSERT INTO tbl_employee_role (employee_id, role)
        VALUES ${rolePlaceholders.join(", ")}
        ON CONFLICT (employee_id, role) DO NOTHING
        `,
        roleValues
      );
    }

    await client.query("COMMIT");

    return { message: "Approver configuration updated successfully" };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



exports.getApproversByRequestType = async (filters = {}) => {
  const { request_type_id, department } = filters;

  const conditions = [`is_active = true`];
  const values = [];
  let index = 1;

  if (request_type_id) {
    conditions.push(`request_type_id = $${index++}`);
    values.push(request_type_id);
  }

  if (department) {
    conditions.push(`department = $${index++}`);
    values.push(department);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;
  const query = `
  SELECT
    request_type_id,
    rt.req_name AS request_name,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'department', department,
        'approvals', approvals
      )
      ORDER BY department
    ) AS departments
  FROM (
    SELECT
      request_type_id,
      department,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'approval_level', approval_level,
          'approvers', approvers
        )
        ORDER BY approval_level
      ) AS approvals
    FROM (
      SELECT
        request_type_id,
        department,
        approval_level,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', id,
            'approver_emp_uuid', approver_emp_uuid,
            'approver_name', approver_name
          )
          ORDER BY approver_name
        ) AS approvers
      FROM tbl_department_approvers
      ${whereClause}
      GROUP BY
        request_type_id,
        department,
        approval_level
    ) lvl
    GROUP BY
      request_type_id,
      department
  ) dept
  JOIN tbl_req_master rt ON rt.rid = dept.request_type_id
  GROUP BY request_type_id, rt.req_name
  ORDER BY request_type_id;
`;

  const { rows } = await pool.query(query, values);
  return rows;
};


exports.getDepartmentMaster = async () => {
  const query = `
    SELECT *
    FROM tbl_department_master
    WHERE is_active = true
    ORDER BY department_name
  `;
  const { rows } = await pool.query(query);
  return rows;
};


/**
 * Sync employees from Excel staging table to master table
 * Inserts only non-existing employees based on emp_id
 */
exports.syncEmployeesFromExcel = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = `
      INSERT INTO public.tbl_emp_master (
          emp_id,
          emp_name,
          emp_department,
          emp_designation,
          emp_status,
          emp_password,
          emp_role,
          emp_uuid
      )
      SELECT
          e.emp_code::varchar,
          e.full_name,
          e.department,
          e.designation,
          e.is_active,
          md5('Japfa@123'),
          'EMP',
          gen_random_uuid()
      FROM public.tbl_emp_master_excel e
      WHERE e.emp_code IS NOT NULL
        AND NOT EXISTS (
            SELECT 1
            FROM public.tbl_emp_master m
            WHERE m.emp_id = e.emp_code::varchar
        )
      RETURNING emp_id;
    `;

    const result = await client.query(query);

    await client.query("COMMIT");

    return {
      insertedCount: result.rowCount,
      insertedEmployees: result.rows
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.insertOnlyNewEmployees = async (records) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* Step 1: Fetch existing emp_code */
    const empCodes = records.map(r => Number(r.emp_code));

    const existingResult = await client.query(
      `SELECT emp_code
         FROM tbl_emp_master_excel
        WHERE emp_code = ANY($1)`,
      [empCodes]
    );

    const existingSet = new Set(existingResult.rows.map(r => r.emp_code));

    /* Step 2: Filter only new records */
    const newRecords = records.filter(
      r => !existingSet.has(Number(r.emp_code))
    );

    if (newRecords.length === 0) {
      await client.query("ROLLBACK");
      return 0;
    }

    /* Step 3: Prepare bulk insert */
    const values = [];
    const placeholders = [];

    newRecords.forEach((r, index) => {
      const base = index * 29;

      placeholders.push(`(
        $${base + 1},  $${base + 2},  $${base + 3},  $${base + 4},  $${base + 5},
        $${base + 6},  $${base + 7},  $${base + 8},  $${base + 9},  $${base + 10},
        $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15},
        $${base + 16}, $${base + 17}, $${base + 18}, $${base + 19}, $${base + 20},
        $${base + 21}, $${base + 22}, $${base + 23}, $${base + 24}, $${base + 25},
        $${base + 26}, $${base + 27}, $${base + 28}, $${base + 29}
      )`);

      values.push(
        r.id || null,
        Number(r.emp_code) || null,
        r.emp_uuid || null,
        r.first_name || null,
        r.last_name || null,
        r.full_name || null,
        r.official_email || null,
        r.personal_email || null,
        r.mobile_number ? Number(r.mobile_number) : null,
        r.designation || null,
        r.department || null,
        r.grade || null,
        r.band || null,
        r.employment_type || null,
        r.employment_status || null,
        r.date_of_joining || null,
        r.date_of_relieving || null,
        r.l1_manager_code ? Number(r.l1_manager_code) : null,
        r.l1_manager_name || null,
        r.l1_manager_email || null,
        r.l2_manager_code ? Number(r.l2_manager_code) : null,
        r.l2_manager_name || null,
        r.l2_manager_email || null,
        r.work_location || null,
        r.org_unit_hierarchy || null,
        r.source_system || null,
        r.is_active || null,
        r.created_at || null,
        r.updated_at || null
      );
    });

    const insertQuery = `
      INSERT INTO tbl_emp_master_excel (
        id, emp_code, emp_uuid, first_name, last_name, full_name,
        official_email, personal_email, mobile_number, designation, department,
        grade, band, employment_type, employment_status,
        date_of_joining, date_of_relieving,
        l1_manager_code, l1_manager_name, l1_manager_email,
        l2_manager_code, l2_manager_name, l2_manager_email,
        work_location, org_unit_hierarchy, source_system,
        is_active, created_at, updated_at
      )
      VALUES ${placeholders.join(",")}
    `;

    await client.query(insertQuery, values);
    await client.query("COMMIT");

    return newRecords.length;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
