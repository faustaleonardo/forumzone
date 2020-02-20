const { promisify } = require('util');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    minlength: [3, 'Your name must be longer than 3 characters'],
    maxlength: [50, 'Your name must not be longer than 50 characters']
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: [8, 'Your password must be longer than 8 characters']
  },
  // do not saved into DB
  passwordConfirmation: {
    type: String,
    required: [true, 'Please provide your password confirmation'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Your password does not match'
    }
  },
  photo: {
    type: String
  },
  job: [Array],
  accessibility: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  active: {
    type: Boolean,
    default: true
  }
});

userSchema.methods.hashPassword = async function() {
  return await promisify(bcrypt.hash)(this.password, 12);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  this.password = await this.hashPassword();

  // exclude passwordConfirmation field to persist in DB
  this.passwordConfirmation = undefined;

  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
