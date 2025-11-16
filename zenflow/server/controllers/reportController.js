const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// @desc    Get weekly productivity report for LOGGED IN user
// @route   GET /api/reports/weekly
// @access  Private
const getWeeklyReport = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const completedTasks = await Task.find({
    user: req.user.id, 
    completedAt: {
      $ne: null,
      $gte: sevenDaysAgo,
    },
  });

  const totalTasksCompleted = completedTasks.length;
  const totalPomodoros = completedTasks.reduce(
    (sum, task) => sum + (task.pomodoroCount || 0),
    0
  );

  res.status(200).json({
    totalTasksCompleted,
    totalPomodoros,
    tasks: completedTasks,
  });
});

module.exports = {
  getWeeklyReport,
};