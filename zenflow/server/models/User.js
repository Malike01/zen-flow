const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, 
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6, 
    },
    
    settings: {
      enableMusic: {
        type: Boolean,
        default: true, 
      },
    },
  },
  {
    timestamps: true, 
  }
);


module.exports = mongoose.model('User', UserSchema);