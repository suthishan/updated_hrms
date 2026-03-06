const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginLimiter } = require('../utils/rate-limitter');


router.post('/login',
  /* 
      #swagger.tags = ['Auth']
      #swagger.path = '/api/auth/login'
    */
  loginLimiter, authController.login);

router.post('/refresh',
  /* 
      #swagger.path = '/api/auth/refresh' 
      #swagger.tags = ['Auth']
    */
  authController.refreshToken);

router.post('/verify-otp',

  /* 
      #swagger.path = '/api/auth/verify-otp'
      #swagger.tags = ['Auth']
    */
  authController.verifyOTP);


router.post('/logout',
  /* 
      #swagger.tags = ['Auth']
       #swagger.path = '/api/auth/logout'
    */
  authController.logout);



module.exports = router;