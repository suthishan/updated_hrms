
// exports.authMiddleware = (req, res, next) => {
//   next();
// };

// exports.allowRoles = (...roles) => {
//   return (req, res, next) => {
//     console.log("User detials "+req.user.roles)
//     if (!roles.includes(req.user.roles)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
//   };
// };


