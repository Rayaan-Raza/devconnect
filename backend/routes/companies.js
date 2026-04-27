const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  getAllCompanies,
  verifyCompany
} = require('../controllers/companyController');

// Public profile view
router.get('/:id', getCompanyProfile);

// Protected routes (company owner or admin)
router.put('/me', protect, authorize('company', 'admin'), updateCompanyProfile);
router.post('/me/logo', protect, authorize('company'), uploadLogo);

// Admin routes
router.get('/', protect, authorize('admin'), getAllCompanies);
router.put('/:id/verify', protect, authorize('admin'), verifyCompany);

module.exports = router;
