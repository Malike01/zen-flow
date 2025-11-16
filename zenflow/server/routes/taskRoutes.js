const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask, completePomodoro} = require('../controllers/taskController');


router.route('/').post(createTask);

router.route('/:id').put(updateTask).delete(deleteTask);

router.route('/:id/complete-pomodoro').put(completePomodoro);

module.exports = router;