const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ColumnSchema = new Schema({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Board',
  },
  title: {
    type: String,
    required: [true, 'Please provide a column title'],
    trim: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

module.exports = mongoose.model('Column', ColumnSchema);