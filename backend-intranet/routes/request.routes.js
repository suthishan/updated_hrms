const express = require('express');
const router = express.Router();
const requestcontroller = require('../controllers/request.controller');
const approvalController = require('../controllers/approval.controller');
// const { allowRoles } = require('../middleware/rbac'); 
const { authenticate ,allowRoles} = require('../middleware/auth.middleware')

router.post('/createRequest', 
    /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/createRequest'
    */ 
  requestcontroller.createRequest);

router.post('/updateFormData',  
   /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/updateFormData'
    */ 
  requestcontroller.updateFormData);

router.get('/getRequests', 
   /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/getRequests'
    */ 
  requestcontroller.getRequests);

router.post('/getRequestsbyrole',  
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/getRequestsbyrole'
    */ 
  requestcontroller.getRequestsbyrole);

router.post('/get-Request-byid', 
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/get-Request-byid'
    */  
  requestcontroller.getRequest);

router.post('/approve',  
  authenticate, // first authenticate
  allowRoles('APPROVER'), // then check roles
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/approve'
    */ 
  approvalController.approve
);



router.post('/approver/history',  
  authenticate, // first authenticate
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/approver/history'
    */ 
  requestcontroller.approverHistory
);

router.post('/dash/overview',  
  authenticate, // first authenticate
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/dash/overview'
    */ 
  requestcontroller.dashOverview
);

router.get('/fetch/request-notifications',  
  authenticate, // first authenticate
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/fetch/request-notifications'
    */ 
  requestcontroller.fetchRequestNotifications
);

router.get('/fetch/tagged-request',  
  authenticate, // first authenticate
     /* 
      #swagger.tags = ['Requests']
      #swagger.path = '/api/requests/fetch/tagged-request'
    */ 
  requestcontroller.fetchTaggedRequests
);





module.exports = router;
