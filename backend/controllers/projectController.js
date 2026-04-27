const Project = require('../models/Project');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const { sendProjectApprovedEmail, sendProjectRejectedEmail } = require('../utils/email');
const User = require('../models/User');

// @desc    Create project
// @route   POST /api/projects
// @access  Private (student)
exports.createProject = async (req, res) => {
  try {
    const {
      title, tagline, abstract, problemStatement, solution,
      techStack, category, department, supervisor, teamMembers,
      githubRepo, liveDemoUrl, demoVideoUrl, documentationUrl,
      achievements, awards, academicYear,
    } = req.body;

    const techStackArr = Array.isArray(techStack) ? techStack : (techStack || '').split(',').map(s => s.trim()).filter(Boolean);
    const achievementsArr = Array.isArray(achievements) ? achievements : (achievements || '').split(',').map(s => s.trim()).filter(Boolean);
    const awardsArr = Array.isArray(awards) ? awards : (awards || '').split(',').map(s => s.trim()).filter(Boolean);

    let parsedTeam = teamMembers;
    if (typeof teamMembers === 'string') {
      try { parsedTeam = JSON.parse(teamMembers); } catch { parsedTeam = []; }
    }
    let parsedSupervisor = supervisor;
    if (typeof supervisor === 'string') {
      try { parsedSupervisor = JSON.parse(supervisor); } catch { parsedSupervisor = {}; }
    }

    const project = await Project.create({
      title, tagline, abstract, problemStatement, solution,
      techStack: techStackArr,
      category, department,
      supervisor: parsedSupervisor || {},
      teamMembers: parsedTeam || [],
      owner: req.user._id,
      githubRepo, liveDemoUrl, demoVideoUrl, documentationUrl,
      achievements: achievementsArr,
      awards: awardsArr,
      academicYear,
      status: 'pending',
    });

    res.status(201).json({ success: true, message: 'Project submitted for review', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all approved projects (with filters)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, department, techStack, search, featured, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};

    // Guests & students see approved; admin can see all
    if (req.user && req.user.role === 'admin') {
      if (status) filter.status = status;
    } else if (req.user && req.user.role === 'student') {
      // Students see approved + their own
      filter.$or = [{ status: 'approved' }, { owner: req.user._id }];
    } else {
      filter.status = 'approved';
    }

    if (category) filter.category = category;
    if (department) filter.department = department;
    if (featured === 'true') filter.isFeatured = true;
    if (techStack) {
      const arr = techStack.split(',').map(s => s.trim());
      filter.techStack = { $in: arr };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('owner', 'name email avatar')
        .skip(skip)
        .limit(Number(limit))
        .sort({ isFeatured: -1, createdAt: -1 })
        .select('-viewedBy'),
      Project.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public (approved) / Private (owner, admin)
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('approvedBy', 'name email');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Check access
    if (project.status !== 'approved') {
      if (!req.user) return res.status(403).json({ success: false, message: 'Project not available' });
      const isOwner = project.owner._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';
      if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Project not available' });
    }

    // Increment view count (unique)
    if (req.user) {
      const alreadyViewed = project.viewedBy.includes(req.user._id);
      if (!alreadyViewed) {
        project.viewedBy.push(req.user._id);
        project.views += 1;
        await project.save({ validateBeforeSave: false });
      }
    } else {
      project.views += 1;
      await project.save({ validateBeforeSave: false });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const fields = ['title', 'tagline', 'abstract', 'problemStatement', 'solution',
      'category', 'department', 'githubRepo', 'liveDemoUrl', 'demoVideoUrl',
      'documentationUrl', 'academicYear'];
    fields.forEach(f => { if (req.body[f] !== undefined) project[f] = req.body[f]; });

    if (req.body.techStack) {
      project.techStack = Array.isArray(req.body.techStack)
        ? req.body.techStack
        : req.body.techStack.split(',').map(s => s.trim());
    }
    if (req.body.teamMembers) {
      project.teamMembers = typeof req.body.teamMembers === 'string'
        ? JSON.parse(req.body.teamMembers) : req.body.teamMembers;
    }
    if (req.body.supervisor) {
      project.supervisor = typeof req.body.supervisor === 'string'
        ? JSON.parse(req.body.supervisor) : req.body.supervisor;
    }

    // Re-submit for review if was rejected
    if (project.status === 'rejected') project.status = 'pending';

    await project.save();
    res.status(200).json({ success: true, message: 'Project updated', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner, admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' });

    // Cleanup Cloudinary files
    if (project.thumbnailPublicId) await deleteFromCloudinary(project.thumbnailPublicId);
    if (project.posterPublicId) await deleteFromCloudinary(project.posterPublicId);
    for (const s of project.screenshots) {
      if (s.publicId) await deleteFromCloudinary(s.publicId);
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload project thumbnail
// @route   POST /api/projects/:id/thumbnail
// @access  Private (owner)
exports.uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (project.thumbnailPublicId) await deleteFromCloudinary(project.thumbnailPublicId);
    const result = await uploadToCloudinary(req.file.buffer, 'thumbnails', {
      transformation: [{ width: 800, height: 500, crop: 'fill' }],
    });
    project.thumbnailUrl = result.secure_url;
    project.thumbnailPublicId = result.public_id;
    await project.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: 'Thumbnail uploaded', url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload project poster
// @route   POST /api/projects/:id/poster
// @access  Private (owner)
exports.uploadPoster = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (project.posterPublicId) await deleteFromCloudinary(project.posterPublicId);
    const result = await uploadToCloudinary(req.file.buffer, 'posters');
    project.posterUrl = result.secure_url;
    project.posterPublicId = result.public_id;
    await project.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: 'Poster uploaded', url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload screenshots
// @route   POST /api/projects/:id/screenshots
// @access  Private (owner)
exports.uploadScreenshots = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const uploads = await Promise.all(
      req.files.map(f => uploadToCloudinary(f.buffer, 'screenshots', {
        transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      }))
    );

    const newScreenshots = uploads.map((r, i) => ({
      url: r.secure_url,
      publicId: r.public_id,
      caption: req.body.captions ? req.body.captions[i] : '',
    }));

    project.screenshots.push(...newScreenshots);
    await project.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: 'Screenshots uploaded', screenshots: project.screenshots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Like a project (company)
// @route   POST /api/projects/:id/like
// @access  Private (company)
exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const idx = project.likes.indexOf(req.user._id);
    if (idx > -1) {
      project.likes.splice(idx, 1);
      await project.save({ validateBeforeSave: false });
      return res.status(200).json({ success: true, liked: false, likesCount: project.likes.length });
    }
    project.likes.push(req.user._id);
    await project.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, liked: true, likesCount: project.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve project (admin)
// @route   PUT /api/projects/:id/approve
// @access  Private (admin)
exports.approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.status = 'approved';
    project.approvedBy = req.user._id;
    project.approvedAt = new Date();
    project.rejectionReason = '';
    await project.save({ validateBeforeSave: false });

    sendProjectApprovedEmail(project.owner.email, project.owner.name, project.title);
    res.status(200).json({ success: true, message: 'Project approved', project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reject project (admin)
// @route   PUT /api/projects/:id/reject
// @access  Private (admin)
exports.rejectProject = async (req, res) => {
  try {
    const { reason } = req.body;
    const project = await Project.findById(req.params.id).populate('owner', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.status = 'rejected';
    project.rejectionReason = reason || 'Does not meet submission guidelines';
    await project.save({ validateBeforeSave: false });

    sendProjectRejectedEmail(project.owner.email, project.owner.name, project.title, project.rejectionReason);
    res.status(200).json({ success: true, message: 'Project rejected', project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Feature/Unfeature project (admin)
// @route   PUT /api/projects/:id/feature
// @access  Private (admin)
exports.featureProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.isFeatured = !project.isFeatured;
    project.featuredAt = project.isFeatured ? new Date() : undefined;
    await project.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: `Project ${project.isFeatured ? 'featured' : 'unfeatured'}`, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get my projects
// @route   GET /api/projects/mine
// @access  Private (student)
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
