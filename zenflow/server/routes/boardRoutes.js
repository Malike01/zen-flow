const express = require('express');
const router = express.Router();

const { getBoard, moveTask } = require('../controllers/boardController');

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect,getBoard);
router.route('/move').put(protect, moveTask);

module.exports = router;