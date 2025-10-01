const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getSummaryReport,
  getRevenueReport,
  getUserGrowthReport,
  exportReport
} = require('../controllers/reportController');

// Reports routes (restricted to analyst/manager/admin)
router.get('/summary', auth, authorize('admin', 'manager', 'analyst'), getSummaryReport);
router.get('/revenue', auth, authorize('admin', 'manager', 'analyst'), getRevenueReport);
router.get('/users/growth', auth, authorize('admin', 'manager', 'analyst'), getUserGrowthReport);
router.get('/export', auth, authorize('admin', 'manager', 'analyst'), exportReport);

module.exports = router;


