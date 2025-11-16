const Column = require('../models/Column');
const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

const getBoard = asyncHandler(async (req, res) => {
  
  try {
    
    const fullBoard = await Column.find({ user: req.user.id }).populate({
      path: 'tasks',
      populate: {
        path: 'tags',
        model: 'Tag',
      },
    });

    if (!fullBoard || fullBoard.length === 0) {
      
      const task1 = await Task.create({ title: 'Welcome Task 1', description: 'Drag me!', user: req.user.id });
      const task2 = await Task.create({ title: 'Welcome Task 2', description: 'Click me to edit', user: req.user.id });

      const defaultColumns = [
        { title: 'To Do', user: req.user.id, tasks: [task1._id, task2._id] },
        { title: 'In Progress', user: req.user.id, tasks: [] },
        { title: 'Done', user: req.user.id, tasks: [] },
      ];

      await Column.insertMany(defaultColumns);

      const newBoard = await Column.find({ user: req.user.id }).populate({
        path: 'tasks',
        populate: { path: 'tags', model: 'Tag' },
      });
      
      return res.status(200).json(newBoard);
    
    }

    res.status(200).json(fullBoard);


  } catch (error) {
    res.status(500);
    throw new Error(`Board fetch error: ${error.message}`);
  }

});

// -----------------------------------------------------------------

const moveTask = asyncHandler(async (req, res) => {
  const {
    taskId,
    sourceColumnId,
    destinationColumnId,
    destinationIndex,
  } = req.body;
  
  const userId = req.user.id;

  const sourceColumn = await Column.findOne({ _id: sourceColumnId, user: userId });
  const destinationColumn = await Column.findOne({ _id: destinationColumnId, user: userId });

  if (!sourceColumn || !destinationColumn) {
    res.status(404);
    throw new Error('Column not found or user not authorized');
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

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      res.status(404);
      throw new Error('Task not found or user not authorized');
    }
    await task.updateOne(completedAtUpdate);
  }

  res.status(200).json({ message: 'Task moved successfully' });
});

// -----------------------------------------------------------------

module.exports = {
  getBoard,
  moveTask
};