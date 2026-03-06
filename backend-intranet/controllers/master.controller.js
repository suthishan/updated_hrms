const MasterModel = require('../models/master.model');
const fs = require("fs");
const csv = require("csv-parser");

exports.getEmployees = async (req, res) => {

  try {

    const { emp_name} = req.body;
    const response = await MasterModel.getEmployees(emp_name);

    if (response.length > 0) {
      return res.status(200).json({
        sts: "1",
        message: "Employee List",
        result: response
      });
    }

    return res.status(200).json({
      sts: "0",
      message: "No Records Found"
    });

  } catch (error) {
    console.error("Error fetching employees:", error);

    return res.status(500).json({
      sts: "0",
      message: error.message || "Internal Server Error"
    });
  }
};

exports.getRequestTypes = async (req, res) => {
  try {
    const response = await MasterModel.getRequestTypes();

    if (response.length > 0) {
      return res.status(200).json({
        sts: "1",
        message: "Request Type List",
        result: response
      });
    }

    return res.status(200).json({
      sts: "0",
      message: "No Records Found"
    });

  } catch (error) {
    console.error("Error fetching request types:", error);

    return res.status(500).json({
      sts: "0",
      message: error.message || "Internal Server Error"
    });
  }
};

exports.assignMultiLevelApprovers = async (req, res) => {
  try {
    const { request_type_id } = req.body; // OR params

    if (!request_type_id) {
      return res.status(400).json({
        sts: "0",
        message: "Request Type ID is required"
      });
    }

    const { department, approvals } = req.body;

    if (!department || !approvals) {
      return res.status(400).json({
        sts: "0",
        message: "Department and approvals are required"
      });
    }

    const result = await MasterModel.assignMultiLevelApprovers(
      request_type_id,
      { department, approvals }
    );

    return res.status(201).json({
      sts: "1",
      message: "Multi-level approvers assigned successfully",
      result
    });

  } catch (error) {
    console.error("Error assigning multi-level approvers:", error);

    return res.status(500).json({
      sts: "0",
      message: error.message || "Internal Server Error"
    });
  }
};

exports.updateMultiLevelApprovers = async (req, res) => {
  try {
    const { request_type_id, department, approvals } = req.body;

    if (!request_type_id) {
      return res.status(400).json({
        sts: "0",
        message: "Request Type ID is required"
      });
    }

    if (!department) {
      return res.status(400).json({
        sts: "0",
        message: "Department is required"
      });
    }

    if (!Array.isArray(approvals) || approvals.length === 0) {
      return res.status(400).json({
        sts: "0",
        message: "Approval configuration is required"
      });
    }

    for (const level of approvals) {
      if (!level.approval_level) {
        return res.status(400).json({
          sts: "0",
          message: "Approval level is required"
        });
      }

      if (!Array.isArray(level.approvers) || level.approvers.length === 0) {
        return res.status(400).json({
          sts: "0",
          message: `Approvers missing for level ${level.approval_level}`
        });
      }

      for (const approver of level.approvers) {
        if (!approver.approver_emp_uuid || !approver.approver_name) {
          return res.status(400).json({
            sts: "0",
            message: `Invalid approver data at level ${level.approval_level}`
          });
        }
      }
    }

    const result = await MasterModel.updateMultiLevelApprovers(
      request_type_id,
      { department, approvals }
    );

    return res.status(200).json({
      sts: "1",
      message: result.message
    });

  } catch (error) {
    console.error("Update multi-level approvers error:", error);

    return res.status(500).json({
      sts: "0",
      message: error.message || "Internal Server Error"
    });
  }
};


exports.getMultiLevelApprovers = async (req, res) => {
  try {
    const { request_type_id, department } = req.query;

    const result = await MasterModel.getApproversByRequestType({
      request_type_id,
      department
    });

    return res.status(200).json({
      sts: "1",
      message: "Approver list fetched successfully",
      result
    });

  } catch (error) {
    console.error("Error fetching approver list:", error);
    return res.status(500).json({
      sts: "0",
      message: error.message || "Internal Server Error"
    });
  }
};

exports.getDepartmentMaster = async (req, res) => {
  try {
    const result = await MasterModel.getDepartmentMaster();

    return res.status(200).json({
      sts: "1",
      message: "Department master list fetched successfully",
      result
    });
  } catch (error) {
    console.error("Error fetching department master list:", error);
    return res.status(500).json({
      sts: "0",
      message: error.message || "Internal Server Error"
    });
  }
};
exports.syncEmployeesFromExcel = async (req, res) => {
  try {
    const result = await MasterModel.syncEmployeesFromExcel();

    return res.status(200).json({
      success: true,
      message: "Employees synced successfully from Excel master",
      inserted_count: result.insertedCount,
      inserted_employees: result.insertedEmployees
    });

  } catch (error) {
    console.error("Employee Sync Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to sync employees from Excel"
    });
  }
};
exports.uploadEmployees = async (req, res) => {
  try {
    const { file }  = req;
    if (!file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const records = [];

    /* Read CSV file */
    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (row) => {
        if (row.emp_code) {
          records.push(row);
        }
      })
      .on("end", async () => {
        fs.unlinkSync(req.file.path);

        if (records.length === 0) {
          return res.status(400).json({ message: "No valid records found" });
        }

        const insertedCount =
          await MasterModel.insertOnlyNewEmployees(records);

        return res.status(200).json({
          message: "CSV processed successfully",
          inserted_records: insertedCount
        });
      });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createReqMaster = async (req, res) => {
  try {
    const {
      req_name,
      req_status,
      req_doc_code
    } = req.body;

    if (!req_name || !req_status || !req_doc_code) {
      return res.status(400).json({
        sts: "0",
        message: "Request Name, Status and Document Code are required"
      });
    }

    const result = await MasterModel.createReqMaster(req.body);

    return res.status(201).json({
      sts: "1",
      message: "Request Master created successfully",
      rid: result.rid
    });

  } catch (error) {
    console.error("Create ReqMaster Error:", error);

    return res.status(500).json({
      sts: "0",
      message: error.message
    });
  }
};


exports.updateReqMaster = async (req, res) => {
  try {
    const { rid } = req.params;

    if (!rid) {
      return res.status(400).json({
        sts: "0",
        message: "RID is required"
      });
    }

    const result = await MasterModel.updateReqMaster(rid, req.body);

    return res.status(200).json({
      sts: "1",
      message: "Request Master updated successfully",
      rid: result.rid
    });

  } catch (error) {
    console.error("Update ReqMaster Error:", error);

    return res.status(500).json({
      sts: "0",
      message: error.message
    });
  }
};
