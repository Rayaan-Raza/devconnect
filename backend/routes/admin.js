const express = require('express');
const router = express.Router();
const { getUsers, updateUser, getStats, getPendingCompanies } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/stats', getStats);
router.get('/companies/pending', getPendingCompanies);

module.exports = router;
