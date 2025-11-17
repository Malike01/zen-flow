const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask, completePomodoro, moveTaskInBoard } = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware')

router.use(protect);

router.route('/').post( createTask);

router.route('/move').put(moveTaskInBoard);

router.route('/:id').put(updateTask).delete(deleteTask);

router.route('/:id/complete-pomodoro').put(completePomodoro);

module.exports = router;