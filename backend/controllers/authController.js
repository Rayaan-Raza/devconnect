const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/token');
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require('../utils/email');

// @desc    Register student or company
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, regNumber, department, companyName, industry } = req.body;

    // Validate role
    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be student or company.' });
    }

    // Student email domain check
    if (role === 'student') {
      const allowedDomains = ['@university.edu.pk', '@uet.edu.pk', '@nust.edu.pk', '@comsats.edu.pk', '@fast.edu.pk', '@itu.edu.pk', '@gcu.edu.pk'];
      // For demo, we allow any .edu domain or specific ones
      // Comment: In production, restrict to university domain
      if (!email.includes('.edu') && !email.includes('@devconnect')) {
        // Allow for seeding purposes - just warn
        console.warn(`Student registered with non-edu email: ${email}`);
      }
      if (!regNumber) {
        return res.status(400).json({ success: false, message: 'Registration number is required for students' });
      }
      if (!department) {
        return res.status(400).json({ success: false, message: 'Department is required for students' });
      }
      // Check reg number uniqueness
      const existing = await StudentProfile.findOne({ regNumber });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Registration number already exists' });
      }
    }

    if (role === 'company') {
      if (!companyName) return res.status(400).json({ success: false, message: 'Company name is required' });
      if (!industry) return res.status(400).json({ success: false, message: 'Industry is required' });
    }

    // Check email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    // Create profile
    if (role === 'student') {
      await StudentProfile.create({
        user: user._id,
        regNumber,
        department,
      });
    } else if (role === 'company') {
      await CompanyProfile.create({
        user: user._id,
        companyName,
        industry,
        contactEmail: email,
      });
    }

    sendWelcomeEmail(email, name, role);

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const { token: refreshToken, expiresAt } = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Clean expired tokens
    user.cleanExpiredTokens();

    const accessToken = generateAccessToken(user._id, user.role);
    const { token: refreshToken, expiresAt } = generateRefreshToken(user._id, rememberMe);
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, refreshToken, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (uses HTTP-only cookie)
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Verify token exists in user's list
    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, message: 'Refresh token revoked' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
        await user.save({ validateBeforeSave: false });
      }
    }
    clearRefreshCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const { token, expires } = generatePasswordResetToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save({ validateBeforeSave: false });

    sendPasswordResetEmail(email, user.name, token);

    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    clearRefreshCookie(res);
    res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshTokens -passwordResetToken');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
