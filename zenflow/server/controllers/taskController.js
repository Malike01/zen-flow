const Task = require('../models/Task');
const Column = require('../models/Column');

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
    });

    const todoColumn = await Column.findOne({ title: 'To Do' });

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

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description }, 
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -----------------------------------------------------------------

const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }


    const column = await Column.findOne({ tasks: taskId });

    if (column) {
      await Column.findByIdAndUpdate(
        column._id,
        { $pull: { tasks: taskId } }
      );
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted and removed from column' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -----------------------------------------------------------------

const completePomodoro = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $inc: { pomodoroCount: 1 } }, 
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -----------------------------------------------------------------

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  completePomodoro
};