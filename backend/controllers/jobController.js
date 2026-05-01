const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a job/internship
// @route   POST /api/jobs
// @access  Private (company)
exports.createJob = async (req, res) => {
  try {
    const {
      title, description, requirements, responsibilities,
      type, location, salary, skills, experienceLevel, deadline
    } = req.body;

    const job = await Job.create({
      company: req.user._id,
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements || '').split(',').map(s => s.trim()).filter(Boolean),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities || '').split(',').map(s => s.trim()).filter(Boolean),
      type,
      location,
      salary,
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel,
      deadline
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, location } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter)
      .populate('company', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      jobs,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name email avatar')
      .populate('applicants.student', 'name email avatar');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (owner company)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private (student)
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can apply' });
    }

    const alreadyApplied = job.applicants.find(a => a.student.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }

    const { resumeUrl, coverLetter } = req.body;

    job.applicants.push({
      student: req.user._id,
      resumeUrl,
      coverLetter
    });

    await job.save();
    res.status(200).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
