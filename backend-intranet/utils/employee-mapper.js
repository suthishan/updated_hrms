exports.mapEmployee = (emp) => {
  const b = emp.BasicDetails.BasicDetail;

  return {
    emp_code: b.EmployeeCode,
    first_name: b.FirstName,
    last_name: b.LastName,
    full_name: b.EmployeeName,
    official_email: b.OfficialMailID,
    personal_email: b.PersonalMaildID,
    mobile_number: b.MobileNumber,
    designation: b.DesignationName,
    department: b.OrgUnit3,
    grade: b.Grade,
    band: b.Band,
    employment_type: b.EmploymentType,
    employment_status: b.EmploymentStatus,
    date_of_joining: b.DateOfJoining || null,
    date_of_relieving: b.DateOfRelieving || null,
    l1_manager_code: b.L1ManagerCode,
    l1_manager_name: b.L1ManagerName,
    l1_manager_email: b.L1ManagerEmail,
    l2_manager_code: b.L2ManagerCode,
    l2_manager_name: b.L2ManagerName,
    l2_manager_email: b.L2ManagerEmail,
    work_location: b.WorksiteName,
    org_unit_hierarchy: b.OrgUnitHierarchy,
    is_active: b.EmploymentStatus === 'Active'
  };
};
