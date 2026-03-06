const { verifyToken } = require('../utils/jwt.util');

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sts: "0",
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // attach user to request
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      sts: "0",
      message: "Invalid or expired token"
    });
  }
};

exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ sts: "0", message: "User not authenticated" });
    }

    const userRoles = req.user.emp_role; // this is an array

    // Check if user has at least one allowed role
    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      console.log("Allowed Roles: " + allowedRoles + " | User Roles: " + userRoles);
      return res.status(403).json({ sts: "0", message: "Access denied" });
    }

    next();
  };
};
