const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask, completePomodoro} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, createTask);

router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

router.route('/:id/complete-pomodoro').put(protect, completePomodoro);

module.exports = router;