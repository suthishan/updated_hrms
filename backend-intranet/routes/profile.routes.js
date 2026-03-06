const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate ,allowRoles} = require('../middleware/auth.middleware');
const upload = require('../config/multer.config');

router.post('/update-profile', 
    /* 
      #swagger.tags = ['Profile']
      #swagger.path = '/api/profile/update-profile'
    */ 
     upload.single('signature'),
     upload.single('profile_picture'),
  authenticate, profileController.updateProfile);

module.exports = router;
