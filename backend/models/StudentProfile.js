const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    regNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      default: 'Unassigned'
    },
    university: {
      type: String,
      default: ''
    },
    campusCity: {
      type: String,
      default: ''
    },
    fatherName: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    linkedin: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumePublicId: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    profilePicturePublicId: {
      type: String,
      default: '',
    },
    graduationYear: {
      type: Number,
      min: 2020,
      max: 2030,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 4,
    },
    isHired: {
      type: Boolean,
      default: false,
    },
    hiredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    appliedJobs: [
      {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
