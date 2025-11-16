const express = require('express');
const router = express.Router();
const { getWeeklyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware')

// GET /api/reports/weekly
router.route('/weekly').get(protect,getWeeklyReport);

module.exports = router;