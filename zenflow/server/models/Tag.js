const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please provide a tag name'],
    trim: true,
  },
  color: {
    type: String,
    required: [true, 'Please provide a color'],
    default: '#1677ff', 
  },
}, {
  indexes: [{ unique: true, fields: ['user', 'name'] }]
});

module.exports = mongoose.model('Tag', TagSchema);