const jwt = require('jsonwebtoken');
const User = require('../models/User');

// -------------------------------------------------------
// protect — verifies the JWT and attaches user to req
// Use on any route that requires a logged-in user
// -------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request (without the password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized — token is invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }
};

// -------------------------------------------------------
// requireRole — restricts a route to specific roles
// Usage: requireRole('staff', 'admin')
// -------------------------------------------------------
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This route is for: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, requireRole };