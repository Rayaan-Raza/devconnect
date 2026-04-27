const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const { sendCompanyVerifiedEmail } = require('../utils/email');

// @desc    Get company profile
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ user: req.params.id })
      .populate('user', 'name email createdAt');
    if (!profile) return res.status(404).json({ success: false, message: 'Company not found' });
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get my company profile (owner)
// @route   GET /api/companies/me
// @access  Private (company)
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ user: req.user._id })
      .populate('user', 'name email createdAt')
      .populate('savedProjects', 'title thumbnailUrl status')
      .populate('likedProjects', 'title thumbnailUrl status');
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update company profile (owner)
// @route   PUT /api/companies/me
// @access  Private (company)
exports.updateCompanyProfile = async (req, res) => {
  try {
    const { description, website, location, size, contactEmail, phone, linkedin } = req.body;
    const profile = await CompanyProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    if (description !== undefined) profile.description = description;
    if (website !== undefined) profile.website = website;
    if (location !== undefined) profile.location = location;
    if (size !== undefined) profile.size = size;
    if (contactEmail !== undefined) profile.contactEmail = contactEmail;
    if (phone !== undefined) profile.phone = phone;
    if (linkedin !== undefined) profile.linkedin = linkedin;

    await profile.save();
    res.status(200).json({ success: true, message: 'Profile updated', profile });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload company logo
// @route   POST /api/companies/me/logo
// @access  Private (company)
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

    const profile = await CompanyProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    if (profile.logoPublicId) await deleteFromCloudinary(profile.logoPublicId);

    const result = await uploadToCloudinary(req.file.buffer, 'logos', {
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });

    profile.logo = result.secure_url;
    profile.logoPublicId = result.public_id;
    await profile.save();

    await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url });

    res.status(200).json({ success: true, message: 'Logo uploaded', url: result.secure_url });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 12, industry, verified } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (industry) filter.industry = industry;
    if (verified === 'true') filter.isVerified = true;

    const [profiles, total] = await Promise.all([
      CompanyProfile.find(filter)
        .populate('user', 'name email createdAt isActive')
        .skip(skip)
        .limit(Number(limit))
        .sort({ isVerified: -1, createdAt: -1 }),
      CompanyProfile.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, profiles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await CompanyProfile.findById(id);
    if (!profile) return res.status(404).json({ success: false, message: 'Company not found' });
    profile.isVerified = true;
    await profile.save();
    // send email to owner
    const owner = await User.findById(profile.user);
    if (owner) {
      sendCompanyVerifiedEmail(owner.email, profile.companyName);
    }
    res.status(200).json({ success: true, message: 'Company verified', profile });
  } catch (error) {
    console.error('Verify company error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Save/Unsave a project
// @route   POST /api/companies/projects/:projectId/save
// @access  Private (company)
exports.saveProject = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const projectId = req.params.projectId;
    const idx = profile.savedProjects.indexOf(projectId);
    if (idx > -1) {
      profile.savedProjects.splice(idx, 1);
      await profile.save();
      return res.status(200).json({ success: true, saved: false, message: 'Project unsaved' });
    }
    profile.savedProjects.push(projectId);
    await profile.save();
    res.status(200).json({ success: true, saved: true, message: 'Project saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
