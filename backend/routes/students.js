const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentProfile,
  getMyProfile,
  updateMyProfile,
  uploadResume,
  uploadAvatar,
  getAllStudents,
} = require('../controllers/studentController');

// Admin and companies can view all students
router.get('/', protect, authorize('admin', 'company'), getAllStudents);

// My profile routes (must come before /:id)
router.get('/me', protect, authorize('student'), getMyProfile);
router.put('/me', protect, authorize('student', 'admin'), updateMyProfile);
router.post('/me/resume', protect, authorize('student'), uploadResume);
router.post('/me/avatar', protect, authorize('student'), uploadAvatar);

// Public profile view
router.get('/:id', getStudentProfile);

module.exports = router;
