const pool = require('../db/db');

exports.upsertEmployee = async (e) => {
  await pool.query(`
    INSERT INTO tbl_employee_master (
      emp_code, first_name, last_name, full_name,
      official_email, personal_email, mobile_number,
      designation, department, grade, band,
      employment_type, employment_status,
      date_of_joining, date_of_relieving,
      l1_manager_code, l1_manager_name, l1_manager_email,
      l2_manager_code, l2_manager_name, l2_manager_email,
      work_location, org_unit_hierarchy, is_active
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,
      $8,$9,$10,$11,$12,$13,
      $14,$15,$16,$17,$18,
      $19,$20,$21,$22,$23,$24
    )ON CONFLICT (emp_code)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      designation = EXCLUDED.designation,
      department = EXCLUDED.department,
      employment_status = EXCLUDED.employment_status,
      is_active = EXCLUDED.is_active,
      updated_at = NOW()`, Object.values(e));
};
