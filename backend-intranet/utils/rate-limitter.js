const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    sts: "0",
    message: "Too many login attempts. Try again later."
  }
});
