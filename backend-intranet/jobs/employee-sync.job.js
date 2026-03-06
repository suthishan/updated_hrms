const { fetchEmployeeMaster } = require('../services/crontpeoplestrong');
const { mapEmployee } = require('../utils/employee-mapper');
const EmployeeModel = require('../models/employee.model');
const pool = require('../db/db');

exports.runEmployeeSync = async () => {
  const start = new Date();

  try {
    const data = await fetchEmployeeMaster({
      token: process.env.PEOPLESTRONG_ACCESS_TOKEN,
      apiKey: process.env.PEOPLESTRONG_API_KEY
    });

    const employees = data.root.EmployeeMaster.EmployeeMasterData;

    for (const emp of employees) {
      const mapped = mapEmployee(emp);

      // store raw
      await pool.query(
        `INSERT INTO tbl_employee_raw_payload(emp_code, payload)
         VALUES ($1,$2)`,
        [mapped.emp_code, emp]
      );

      await EmployeeModel.upsertEmployee(mapped);
    }

    await pool.query(`
      INSERT INTO tbl_employee_sync_log
      (sync_type, total_records, status, started_at, completed_at)
      VALUES ('FULL', $1, 'SUCCESS', $2, NOW())
    `, [employees.length, start]);

  } catch (err) {
    await pool.query(`
      INSERT INTO tbl_employee_sync_log
      (sync_type, status, message, started_at, completed_at)
      VALUES ('FULL', 'FAILED', $1, $2, NOW())
    `, [err.message, start]);

    throw err;
  }
};
