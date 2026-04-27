const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      maxlength: [2000, 'Abstract cannot exceed 2000 characters'],
    },
    problemStatement: {
      type: String,
      maxlength: [1000, 'Problem statement cannot exceed 1000 characters'],
      default: '',
    },
    solution: {
      type: String,
      maxlength: [1000, 'Solution cannot exceed 1000 characters'],
      default: '',
    },
    techStack: [{ type: String, trim: true }],
    category: {
      type: String,
      required: true,
      enum: [
        'Artificial Intelligence',
        'Web Development',
        'Mobile App',
        'IoT',
        'Blockchain',
        'Cybersecurity',
        'Data Science',
        'Game Development',
        'AR/VR',
        'Other',
      ],
    },
    department: { type: String, required: true },
    supervisor: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    teamMembers: [
      {
        name: { type: String, required: true },
        regNumber: { type: String, default: '' },
        role: { type: String, default: 'Developer' },
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Media & Links
    thumbnailUrl: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    screenshots: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    posterUrl: { type: String, default: '' },
    posterPublicId: { type: String, default: '' },
    demoVideoUrl: { type: String, default: '' },
    githubRepo: { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
    documentationUrl: { type: String, default: '' },
    // Achievements & Awards
    achievements: [{ type: String }],
    awards: [{ type: String }],
    // Status
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFeatured: { type: Boolean, default: false },
    featuredAt: { type: Date },
    rejectionReason: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    // Analytics
    views: { type: Number, default: 0 },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Year
    academicYear: { type: String, default: '' },
  },
  { timestamps: true }
);

// Text search index
projectSchema.index({
  title: 'text',
  abstract: 'text',
  techStack: 'text',
  category: 'text',
});

module.exports = mongoose.model('Project', projectSchema);
