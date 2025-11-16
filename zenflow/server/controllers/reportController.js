const Task = require('../models/Task');

// @desc    Get weekly productivity report
// @route   GET /api/reports/weekly
// @access  Public
const getWeeklyReport = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const completedTasks = await Task.find({
      completedAt: {
        $ne: null, 
        $gte: sevenDaysAgo 
      }
    });

    const totalTasksCompleted = completedTasks.length;

    const totalPomodoros = completedTasks.reduce(
      (sum, task) => sum + (task.pomodoroCount || 0), // (task.pomodoroCount || 0) -> null/undefined
      0
    );

    res.status(200).json({
      totalTasksCompleted,
      totalPomodoros,
      tasks: completedTasks, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getWeeklyReport,
};