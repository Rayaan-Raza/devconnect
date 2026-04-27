const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: { type: String, required: true, trim: true },
  industry: { type: String, required: true },
  contactEmail: {
    type: String,
    required: true,
    validate: { validator: validator.isEmail, message: 'Invalid email' }
  },
  website: { type: String, trim: true, default: '' },
  logo: { type: String, default: '' },
  logoPublicId: { type: String, default: '' },
  description: { type: String, maxlength: 2000, default: '' },
  location: { type: String, default: '' },
  size: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verificationBadge: { type: String, default: '' },
  likedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companySchema);
