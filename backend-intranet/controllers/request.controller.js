const RequestModel = require('../models/request.model');
const { auditLog } = require('../utils/audit.util');
const { sendMail } = require('../utils/email.util');
exports.approverHistory = async (req, res) => {
  try {
    const { emp_uuid, size } = req.body;
    const result = await RequestModel.getApproverHistory(emp_uuid, size);
    return res.json({
      sts: "1",
      message: "Approver history fetched successfully",
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sts: "0",
      message: "Failed to fetch approver history"
    });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const {
      emp_uuid,
      request_type_id,
      requester_name,
      department,
      priority
    } = req.body;
    if (!emp_uuid || !request_type_id || !requester_name || !department) {
      return res.status(400).json({
        sts: "0",
        message: "emp_uuid, request_type_id, requester_name, department and priority are required"
      });

    }
    const reqMaster = await RequestModel.getRequestTypeById(request_type_id);
    if (!reqMaster) {
      return res.status(400).json({
        sts: "0",
        message: "Invalid request_type_id"
      });
    }
    const requestRows = await RequestModel.createRequest({
      emp_uuid,
      request_type_id,
      requester_name,
      department,
      priority,
      form_data: null,
      status: 'DRAFT'
    });


    if (!requestRows || requestRows.length === 0) {
      return res.json({
        sts: "0",
        message: "Request not created"
      });
    }
   const newRequest = requestRows[0];
    if (reqMaster?.is_required_approver_flow) {
   

      await RequestModel.createApprovalFlow(
        newRequest.id,
        newRequest.department,
        newRequest.request_type_id
      );
    }

    await auditLog({
      user: {
        emp_uuid: req.user.emp_uuid,
        emp_name: req.user.emp_name,
        emp_role: req.user.emp_role
      },
      action: 'New Form Request Created',
      entityType: 'FORM REQUEST',
      entityId: req.user.emp_uuid,
      oldValue: null,
      newValue: null,
      req
    });

    return res.status(200).json({
      sts: "1",
      message: "Request created",
      result: newRequest
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sts: "0",
      message: err.message
    });
  }
};
exports.fetchRequestNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for emp_uuid:", req.user.emp_uuid);
    const result = await RequestModel.fetchRequestNotifications(req.user.emp_uuid);
    return res.json({
      sts: "1",
      message: "Notifications fetched successfully",
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sts: "0",
      message: "Failed to fetch notifications"
    });
  }
};

exports.updateFormData = async (req, res) => {
  try {
    const { requestId, form_data , status} = req.body;
    console.log(req.body);

    const updated = await RequestModel.updateFormData(
      requestId,
      form_data,
      status
    );

    if (!updated) {
      return res.json({
        sts: "0",
        message: "Request not found"
      });
    }
    await auditLog({
      user: {
        emp_uuid: req.user.emp_uuid,
        emp_name: req.user.emp_name,
        emp_role: req.user.emp_role
      },
      action: 'Updating Form Request Data',
      entityType: 'FORM REQUEST',
      entityId: req.user.emp_uuid,
      oldValue: null,
      newValue: null,
      req
    });
    return res.json({
      sts: "1",
      message: "Form data saved successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sts: "0",
      message: err.message
    });
  }
};



exports.getRequests = async (req, res) => {
  try {
    const requests = await RequestModel.getAllRequests();

    return res.json({
      sts: "1",
      message: "Request list fetched successfully",
      result: requests
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sts: "0",
      message: "Failed to fetch requests"
    });
  }
};

exports.dashOverview = async (req, res) => {
  try {
    const { emp_uuid, emp_role } = req.body;

    let result;

    switch (emp_role) {
      case 'REQUESTER':
        result = await RequestModel.fetchDashboardOverview(emp_uuid, emp_role);
        break;

      case 'APPROVER_L1':
        result = await RequestModel.fetchDashboardOverview(emp_uuid, emp_role);
        break;

      case 'APPROVER_L2':
        result = await RequestModel.fetchDashboardOverview(emp_uuid, emp_role);
        break;

      case 'ADMIN':
        result = await RequestModel.fetchDashboardOverview(emp_uuid, emp_role);
        break;

      default:
        return res.status(403).json({
          sts: '0',
          message: 'Unauthorized role'
        });
    }

    return res.json({
      sts: "1",
      message: "Requests fetched successfully",
      result: result
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sts: "0",
      message: "Failed to fetch requests"
    });
  }
};


exports.getRequestsbyrole = async (req, res) => {
  try {
    const { emp_uuid, emp_role, size } = req.body;

    let result;

    switch (emp_role) {
      case 'REQUESTER':
        result = await RequestModel.getRequestsByRequester(emp_uuid, size);
        break;

      case 'APPROVER_L1':
        result = await RequestModel.getL1PendingRequests(emp_uuid, size);
        break;

      case 'APPROVER_L2':
      case 'APPROVER_L3':
      case 'APPROVER_L4':
        result = await RequestModel.getL2PendingRequests(emp_uuid, size);
        break;

      case 'ADMIN':
        result = await RequestModel.getAllRequestsAdmin(size);
        break;

      default:
        return res.status(403).json({
          sts: '0',
          message: 'Unauthorized role'
        });
    }

    return res.json({
      sts: "1",
      message: "Requests fetched successfully",
      result: result
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sts: "0",
      message: "Failed to fetch requests"
    });
  }
};




exports.getRequest = async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({
        sts: "0",
        message: "request_id is required"
      });
    }

    const request = await RequestModel.getRequestById(request_id);

    if (!request) {
      return res.status(404).json({
        sts: "0",
        message: "Request not found"
      });
    }

    return res.json({
      sts: "1",
      message: "Request details fetched",
      result: request
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sts: "0",
      message: error.message || "Server error"
    });
  }
};

