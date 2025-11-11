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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', TaskSchema);