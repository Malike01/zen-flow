const express = require('express');
const router = express.Router();

const { getBoard } = require('../controllers/boardController');

router.route('/').get(getBoard);
router.route('/move').put(moveTask);

module.exports = router;