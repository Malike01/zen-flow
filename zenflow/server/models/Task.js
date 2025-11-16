const mongoose = require('mongoose');

// We are defining what a "Task" will look like in the database.
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'], // Title is required
      trim: true, // Trims whitespace from the beginning and end
    },
    description: {
      type: String,
      trim: true,
      default: '', 
    },
    pomodoroCount: {
      type: Number,
      default: 0, 
    },
    completedAt: {
      type: Date, 
      default: null, 
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tag', 
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', TaskSchema);