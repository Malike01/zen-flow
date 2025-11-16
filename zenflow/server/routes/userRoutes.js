const express = require('express');
const router = express.Router();
const { updateUserSettings } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// PUT /api/users/settings
router.put('/settings', protect, updateUserSettings);

module.exports = router;