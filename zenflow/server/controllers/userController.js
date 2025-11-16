const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
const updateUserSettings = asyncHandler(async (req, res) => {
  const { enableMusic } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (enableMusic !== undefined) {
    user.settings.enableMusic = enableMusic;
  }

  const updatedUser = await user.save();

  res.status(200).json(updatedUser.settings);
});

module.exports = {
  updateUserSettings,
};