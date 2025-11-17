const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Column = require('../models/Column');
const Board = require('../models/Board'); 

// -----------------------------------------------------------------
// @desc    Create a new task for a specific board/column
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, tags, boardId, columnId } = req.body;

  if (!title || !boardId || !columnId) {
    res.status(400);
    throw new Error('Missing required fields: title, boardId, columnId');
  }

  const board = await Board.findById(boardId);
  if (!board || !board.members.map(m => m.toString()).includes(req.user.id)) {
    res.status(403); // Yasaklı
    throw new Error('User not authorized for this board');
  }

  const newTask = await Task.create({
    title,
    description,
    tags, 
    board: boardId,
  });

  await Column.findByIdAndUpdate(
    columnId,
    { $push: { tasks: newTask._id } }
  );

  res.status(201).json(newTask);
});

// -----------------------------------------------------------------
// @desc    Update a task's text fields (title, description, tags)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const { title, description, tags } = req.body; // Güncellenecek alanlar

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404); throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  if (!board || !board.members.map(m => m.toString()).includes(req.user.id)) {
    res.status(403);
    throw new Error('User not authorized to update tasks on this board');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { title, description, tags },
    { new: true, runValidators: true }
  ).populate('tags'); 

  res.status(200).json(updatedTask);
});

// -----------------------------------------------------------------
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404); throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  if (!board || !board.members.map(m => m.toString()).includes(req.user.id)) {
    res.status(403);
    throw new Error('User not authorized to delete tasks on this board');
  }

  await Column.updateMany(
    { board: task.board }, 
    { $pull: { tasks: taskId } } 
  );

  await Task.findByIdAndDelete(taskId);

  res.status(200).json({ message: 'Task deleted successfully' });
});

// -----------------------------------------------------------------
// @desc    Increment the pomodoro count for a task
// @route   PUT /api/tasks/:id/complete-pomodoro
// @access  Private
const completePomodoro = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404); throw new Error('Task not found');
  }

  const board = await Board.findById(task.board);
  if (!board || !board.members.map(m => m.toString()).includes(req.user.id)) {
    res.status(403);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $inc: { pomodoroCount: 1 } },
    { new: true }
  ).populate('tags'); 

  res.status(200).json(updatedTask);
});

// -----------------------------------------------------------------
// @desc    Move a task within or between columns (Sürükle-Bırak)
// @route   PUT /api/tasks/move
// @access  Private
const moveTaskInBoard = asyncHandler(async (req, res) => {
  const {
    taskId,
    sourceColumnId,
    destinationColumnId,
    destinationIndex,
    boardId, 
  } = req.body;
  const userId = req.user.id;

  const board = await Board.findById(boardId);
  if (!board || !board.members.map(m => m.toString()).includes(userId)) {
    res.status(403);
    throw new Error('User not authorized for this board');
  }

  const sourceColumn = await Column.findOne({ _id: sourceColumnId, board: boardId });
  const destinationColumn = await Column.findOne({ _id: destinationColumnId, board: boardId });

  if (!sourceColumn || !destinationColumn) {
    res.status(404);
    throw new Error('Column not found or does not belong to this board');
  }

  let completedAtUpdate = {};

  if (sourceColumnId === destinationColumnId) {
    await Column.findByIdAndUpdate(sourceColumnId, { $pull: { tasks: taskId } });
    await Column.findByIdAndUpdate(sourceColumnId, {
      $push: { tasks: { $each: [taskId], $position: destinationIndex } },
    });
  } else {
    await Column.findByIdAndUpdate(sourceColumnId, { $pull: { tasks: taskId } });
    await Column.findByIdAndUpdate(destinationColumnId, {
      $push: { tasks: { $each: [taskId], $position: destinationIndex } },
    });

    if (destinationColumn.title === 'Done') {
      completedAtUpdate = { completedAt: new Date() };
    } else {
      completedAtUpdate = { completedAt: null };
    }
    await Task.findByIdAndUpdate(taskId, completedAtUpdate);
  }

  res.status(200).json({ message: 'Task moved successfully' });
});


module.exports = {
  createTask,
  updateTask,
  deleteTask,
  completePomodoro,
  moveTaskInBoard
};