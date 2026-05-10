const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Generate short-lived access token
exports.generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      name: user.name, 
      email: user.email, 
      isProfileComplete: user.isProfileComplete 
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

// Generate long-lived refresh token
exports.generateRefreshToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? '7d' : '1d';
  const token = jwt.sign(
    { id: userId, tokenId: uuidv4() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn }
  );
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 7 : 1));
  return { token, expiresAt };
};

// Verify refresh token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Generate password reset token
exports.generatePasswordResetToken = () => {
  const token = uuidv4().replace(/-/g, '');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, expires };
};

// Set refresh token cookie
exports.setRefreshCookie = (res, token, rememberMe = false) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'strict',
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });
};

// Clear refresh token cookie
exports.clearRefreshCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'strict',
    expires: new Date(0),
  });
};
