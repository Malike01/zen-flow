const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask} = require('../controllers/taskController');


router.route('/').post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;