const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCompanyProfile,
  getMyProfile,
  updateCompanyProfile,
  uploadLogo,
  getAllCompanies,
  verifyCompany
} = require('../controllers/companyController');

// Public list
router.get('/', getAllCompanies);

// My profile routes (must come before /:id)
router.get('/me', protect, authorize('company'), getMyProfile);
router.put('/me', protect, authorize('company', 'admin'), updateCompanyProfile);
router.post('/me/logo', protect, authorize('company'), uploadLogo);

// Public profile view
router.get('/:id', getCompanyProfile);

// Admin routes
router.put('/:id/verify', protect, authorize('admin'), verifyCompany);

module.exports = router;
