const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name!'],
    minlength: [3, 'Your name must be longer than 3 characters!'],
    maxlength: [50, 'Your name must not be longer than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: [true, 'This email has been taken. Please use another one!'],
    validate: [validator.isEmail, 'Please provide a valid email!']
  },
  password: {
    type: String,
    required: [true, 'Please provide your password!'],
    minlength: [8, 'Your password must be longer than 8 characters!']
  },
  // do not saved into DB
  passwordConfirmation: {
    type: String,
    required: [true, 'Please provide your password confirmation!'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Your password does not match!'
    }
  },
  photo: {
    type: String,
    required: [true, 'Please provide your photo!']
  },
  job: [Array],
  accessibility: {
    type: Boolean,
    default: true
  },
  role: {
    default: 'user',
    enum: ['user', 'admin']
  },
  active: {
    type: Boolean,
    default: true
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
