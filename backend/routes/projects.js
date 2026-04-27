const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getMyProjects,
  uploadThumbnail,
  uploadPoster,
  uploadScreenshots,
  likeProject,
  approveProject,
  rejectProject,
  featureProject,
} = require('../controllers/projectController');
const { uploadImage, uploadMultipleImages, handleMulterError } = require('../middleware/upload');

router.get('/', getProjects);
router.get('/mine', protect, authorize('student'), getMyProjects);
router.get('/:id', getProject);
router.post('/', protect, authorize('student'), createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/thumbnail', protect, authorize('student'), uploadImage, handleMulterError, uploadThumbnail);
router.post('/:id/poster', protect, authorize('student'), uploadImage, handleMulterError, uploadPoster);
router.post('/:id/screenshots', protect, authorize('student'), uploadMultipleImages, handleMulterError, uploadScreenshots);
router.post('/:id/like', protect, authorize('company'), likeProject);
router.put('/:id/approve', protect, authorize('admin'), approveProject);
router.put('/:id/reject', protect, authorize('admin'), rejectProject);
router.put('/:id/feature', protect, authorize('admin'), featureProject);

module.exports = router;
