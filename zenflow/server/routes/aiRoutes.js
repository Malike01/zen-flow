const express = require('express');
const router = express.Router();
const { generateSubtasks,generateDescription, suggestTags } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-subtasks', protect, generateSubtasks);
router.post('/generate-description', generateDescription);
router.post('/suggest-tags', suggestTags)

module.exports = router;