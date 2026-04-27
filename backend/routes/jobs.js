const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  applyToJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('company', 'admin'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('company', 'admin'), updateJob);

router.post('/:id/apply', protect, authorize('student'), applyToJob);

module.exports = router;
