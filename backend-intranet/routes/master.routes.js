const router = require('express').Router();
const ctrlmaster = require('../controllers/master.controller');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post('/employees', 
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/employees'
    */
    ctrlmaster.getEmployees);

router.get('/request-types',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/request-types'
    */ 
   ctrlmaster.getRequestTypes);

router.post('/create/request-form',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/create/request-form'
    */ 
   ctrlmaster.createReqMaster);   

router.put('/update/request-form/:rid',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/update/request-form/:rid'
    */ 
   ctrlmaster.updateReqMaster);      

router.post('/assign-approver',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/assign-approver'
    */ 
   ctrlmaster.assignMultiLevelApprovers);

router.put('/assign-approver',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/assign-approver'
    */ 
   ctrlmaster.updateMultiLevelApprovers);

router.get('/department-approver',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/department-approver'
    */ 
   ctrlmaster.getMultiLevelApprovers);   

router.get('/department-master',
   /* 
      #swagger.tags = ['Master']
      #swagger.path = '/api/master/department-master'
    */ 
   ctrlmaster.getDepartmentMaster);  

router.post(
  "/upload-employees",
  /*
    #swagger.tags = ['Master']
    #swagger.summary = 'Upload employee CSV file'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['file'] = {
      in: 'formData',
      type: 'file',
      required: true,
      description: 'Employee CSV file'
    }
    #swagger.path = '/api/master/upload-employees'
  */
  upload.single("file"),   // ✅ FIRST read stream
//   authenticate,            // ✅ THEN auth
  ctrlmaster.uploadEmployees
);
router.post(
  "/sync-employees",
  /*
    #swagger.tags = ['Master']
    #swagger.summary = 'Sync employees from Excel master to employee master'
    #swagger.path = '/api/master/sync-employees'
    #swagger.responses[200] = {
      description: 'Employees synced successfully'
    }
  */
  ctrlmaster.syncEmployeesFromExcel
);

module.exports = router;


