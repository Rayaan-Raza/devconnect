const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// @desc    Get student profile
// @route   GET /api/students/:id
// @access  Public
exports.getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.params.id })
      .populate('user', 'name email avatar createdAt');
    if (!profile) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get my profile
// @route   GET /api/students/me
// @access  Private (student)
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar createdAt')
      .populate('appliedJobs.job', 'title company type');
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/me
// @access  Private (student)
exports.updateMyProfile = async (req, res) => {
  try {
    const { bio, skills, keywords, linkedin, github, portfolio, graduationYear, cgpa, university, campusCity, department, fatherName } = req.body;

    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (keywords !== undefined) profile.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(s => s.trim());
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (github !== undefined) profile.github = github;
    if (portfolio !== undefined) profile.portfolio = portfolio;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (university !== undefined) profile.university = university;
    if (campusCity !== undefined) profile.campusCity = campusCity;
    if (department !== undefined) profile.department = department;
    if (fatherName !== undefined) profile.fatherName = fatherName;

    await profile.save();

    // Mark user profile as complete
    await User.findByIdAndUpdate(req.user._id, { isProfileComplete: true });

    res.status(200).json({ success: true, message: 'Profile updated', profile, isProfileComplete: true });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload profile picture
// @route   POST /api/students/me/avatar
// @access  Private (student)
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    // Delete old avatar
    if (profile.profilePicturePublicId) {
      await deleteFromCloudinary(profile.profilePicturePublicId);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'avatars', {
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    profile.profilePicture = result.secure_url;
    profile.profilePicturePublicId = result.public_id;
    await profile.save();

    // Also update user avatar
    await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url });

    res.status(200).json({ success: true, message: 'Avatar uploaded', url: result.secure_url });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload resume
// @route   POST /api/students/me/resume
// @access  Private (student)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    if (profile.resumePublicId) {
      await deleteFromCloudinary(profile.resumePublicId);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'resumes', {
      resource_type: 'raw',
      format: 'pdf',
    });

    profile.resumeUrl = result.secure_url;
    profile.resumePublicId = result.public_id;
    await profile.save();

    res.status(200).json({ success: true, message: 'Resume uploaded', url: result.secure_url });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all students (with filters)
// @route   GET /api/students
// @access  Private (company, admin)
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 12, department, skills, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (department) filter.department = department;
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillArr };
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { skills: { $regex: regex } },
        { keywords: { $regex: regex } },
        { bio: { $regex: regex } },
        { department: { $regex: regex } },
      ];
    }

    let profiles = await StudentProfile.find(filter)
      .populate('user', 'name email avatar createdAt isActive')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Also filter by user name if search is provided
    if (search) {
      const regex = new RegExp(search, 'i');
      profiles = profiles.filter(p => 
        p.user && (
          regex.test(p.user.name) ||
          p.skills?.some(s => regex.test(s)) ||
          p.keywords?.some(k => regex.test(k))
        )
      );
    }

    const total = await StudentProfile.countDocuments(filter);

    res.status(200).json({
      success: true,
      profiles,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Save a job
// @route   POST /api/students/jobs/:jobId/save
// @access  Private (student)
exports.saveJob = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const jobId = req.params.jobId;
    const idx = profile.savedJobs.indexOf(jobId);
    if (idx > -1) {
      profile.savedJobs.splice(idx, 1);
      await profile.save();
      return res.status(200).json({ success: true, message: 'Job unsaved', saved: false });
    }
    profile.savedJobs.push(jobId);
    await profile.save();
    res.status(200).json({ success: true, message: 'Job saved', saved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
