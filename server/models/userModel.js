const { promisify } = require('util');
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
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
      minlength: [8, 'Your password must be longer than 8 characters'],
      select: false
    },
    // not persisted in DB
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
    jobs: Array,
    age: Number,
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
      default: true,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('solveQuestions', {
  ref: 'Question',
  foreignField: 'solvedByUser',
  localField: '_id'
});

userSchema.methods.hashPassword = async function() {
  return await promisify(bcrypt.hash)(this.password, 12);
};

userSchema.methods.verifyPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // valid for 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  this.password = await this.hashPassword();

  // exclude passwordConfirmation field to persist in DB
  this.passwordConfirmation = undefined;

  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
