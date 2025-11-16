const express = require('express');
const router = express.Router();
const { getWeeklyReport } = require('../controllers/reportController');

// GET /api/reports/weekly
router.route('/weekly').get(getWeeklyReport);

module.exports = router;