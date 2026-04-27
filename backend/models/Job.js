const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'remote'],
      required: true,
    },
    location: { type: String, default: 'Remote' },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'PKR' },
      isVisible: { type: Boolean, default: true },
    },
    skills: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior'],
      default: 'entry',
    },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    applicants: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        resumeUrl: { type: String },
        coverLetter: { type: String, default: '' },
        status: {
          type: String,
          enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
          default: 'pending',
        },
      },
    ],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
