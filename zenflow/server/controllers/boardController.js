const Column = require('../models/Column');
const Task = require('../models/Task'); // Task modeline de ihtiyacımız olabilir (örn: veritabanı boşsa)

const getBoard = async (req, res) => {
  try {
    const fullBoard = await Column.find().populate('tasks');

    if (!fullBoard || fullBoard.length === 0) {
      // Create some default tasks first
      const task1 = await Task.create({ title: 'Welcome Task 1', description: 'Drag me!' });
      const task2 = await Task.create({ title: 'Welcome Task 2', description: 'Click me to edit' });

      // Create default columns and add the tasks
      const defaultColumns = [
        { title: 'To Do', tasks: [task1._id, task2._id] },
        { title: 'In Progress', tasks: [] },
        { title: 'Done', tasks: [] },
      ];

      await Column.insertMany(defaultColumns);
      
      // Fetch the newly created board again
      const newBoard = await Column.find().populate('tasks');
      return res.status(200).json(newBoard);
    }
    // --------------------------------------------------

    res.status(200).json(fullBoard);
  } catch (error)
 {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -----------------------------------------------------------------

const moveTask = async (req, res) => {
  try {
    const {
      taskId,
      sourceColumnId,
      destinationColumnId,
      destinationIndex,
    } = req.body;

    let completedAtUpdate = {};

    // --- SCENARIO 1: Task reordering in SAME COLUMN ---
    if (sourceColumnId === destinationColumnId) {
      await Column.findByIdAndUpdate(sourceColumnId, {
        $pull: { tasks: taskId },
      });

      await Column.findByIdAndUpdate(sourceColumnId, {
        $push: {
          tasks: {
            $each: [taskId], 
            $position: destinationIndex,
          },
        },
      });

      res.status(200).json({ message: 'Task reordered within column' });
      
    } else {
      // --- SCENARIO 2: Task moves to a DIFFERENT COLUMN ---
      await Column.findByIdAndUpdate(sourceColumnId, {
        $pull: { tasks: taskId },
      });

      await Column.findByIdAndUpdate(destinationColumnId, {
        $push: {
          tasks: {
            $each: [taskId],
            $position: destinationIndex,
          },
        },
      });

      const destinationColumn = await Column.findById(destinationColumnId);

      if (destinationColumn && destinationColumn.title === 'Done') {
        completedAtUpdate = { completedAt: new Date() }; 
      } else {
        completedAtUpdate = { completedAt: null };
      }
      await Task.findByIdAndUpdate(taskId, completedAtUpdate);
      // ------------------------------------------
    }
    res.status(200).json({ message: 'Task moved to new column' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// -----------------------------------------------------------------

module.exports = {
  getBoard,
  moveTask
};