const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');
const upload = require('../config/multer.config');


/**
 * Get All Policies
 */
router.get('/',
  /*
      #swagger.path = '/api/policy'
      #swagger.tags = ['Policy']
      #swagger.description = 'Get all policies with current version'
  */
  policyController.getPolicies
);


/**
 * Get Single Policy
 */
router.get('/:policy_doc_id',
  /*
      #swagger.path = '/api/policy/{policy_doc_id}'
      #swagger.tags = ['Policy']
      #swagger.description = 'Get single policy with current version'
  */
  policyController.getPolicy
);


/**
 * Update Policy Master
 */
router.put('/:policy_doc_id',
  /*
      #swagger.path = '/api/policy/{policy_doc_id}'
      #swagger.tags = ['Policy']
      #swagger.description = 'Update policy master details'
  */
  policyController.updatePolicy
);


/**
 * Upload New Policy Version
 */
router.post('/upload-version',
  /*
      #swagger.path = '/api/policy/upload-version'
      #swagger.tags = ['Policy']
      #swagger.description = 'Upload new policy version document'
  */
  upload.single('policy_document'),
  policyController.uploadPolicyVersion
);


router.post('/',
  /*
      #swagger.path = '/api/policy'
      #swagger.tags = ['Policy']
      #swagger.description = 'Create new policy with first version'
  */
  upload.single('policy_document'),
  policyController.createPolicy
);

router.post('/consent',
  /*
      #swagger.path = '/api/policy/consent'
      #swagger.tags = ['Policy']
      #swagger.description = 'Employee policy consent submission'
  */
  policyController.createConsent
);


module.exports = router;
