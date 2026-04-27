const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  uploadProfilePicture,
  getAllStudents,
} = require('../controllers/studentController');

// Public profile view
router.get('/:id', getStudentProfile);

// Protected routes for the owner or admin
router.put('/me', protect, authorize('student', 'admin'), updateStudentProfile);
router.post('/me/resume', protect, authorize('student'), uploadResume);
router.post('/me/avatar', protect, authorize('student'), uploadProfilePicture);

// Admin can view all students
router.get('/', protect, authorize('admin'), getAllStudents);

module.exports = router;
