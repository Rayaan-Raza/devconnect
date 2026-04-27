// middleware/auth.js
// Protect routes (verify JWT) and role‑based guard
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify access token (Bearer header)
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    }
    // update last active timestamp
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth protect error:', err);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Role guard – pass allowed roles like ('admin')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied for role '${req.user.role}'` });
    }
    next();
  };
};
