const Task = require('../models/Task');
const Column = require('../models/Column');
const asyncHandler = require('express-async-handler');

// -----------------------------------------------------------------

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // 1. Basic validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // 2. Create the new task document
    const newTask = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    const todoColumn = await Column.findOne({ title: 'To Do', user: req.user.id });

    if (!todoColumn) {
      return res.status(404).json({ message: "'To Do' column not found" });
    }

    await Column.findByIdAndUpdate(
      todoColumn._id,
      { $push: { tasks: newTask._id } }
    );

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -----------------------------------------------------------------

const updateTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const { title, description, tags } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this task');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { title, description, tags },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedTask);
});

// -----------------------------------------------------------------

const deleteTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this task');
  }

  const column = await Column.findOne({ tasks: taskId, user: req.user.id });
  if (column) {
    await Column.findByIdAndUpdate(column._id, { $pull: { tasks: taskId } });
  }

  await Task.findByIdAndDelete(taskId);

  res.status(200).json({ message: 'Task deleted successfully' });
});

// -----------------------------------------------------------------

const completePomodoro = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $inc: { pomodoroCount: 1 } },
    { new: true }
  );

  res.status(200).json(updatedTask);
});

// -----------------------------------------------------------------

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  completePomodoro
};