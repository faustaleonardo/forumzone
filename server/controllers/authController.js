const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const sendToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirmation } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirmation
  });

  const token = sendToken(newUser._id);

  res.status(204).json({
    status: 'success',
    token
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide both email and password', 400));

  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password, user.password)))
    return next(new AppError('Your email or password is incorrect', 401));

  const token = sendToken(user.id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(id);
  req.user = user;

  next();
});
