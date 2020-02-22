const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendToken = (token, res, statusCode) => {
  res.status(statusCode).json({
    status: 'success',
    token
  });
};

const getMessageOptions = (email, url) => {
  const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirmation to: ${url}.\nIf you didn't forget your password, please ignore this email!`;
  const subject = 'Reset Your Password';

  const options = {
    email,
    subject,
    text
  };

  return options;
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirmation } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirmation
  });

  const token = createToken(newUser._id);

  sendToken(token, res, 204);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    next(new AppError('Please provide both email and password', 400));

  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password, user.password)))
    next(new AppError('Your email or password is incorrect', 401));

  const token = createToken(user.id);
  sendToken(token, res, 200);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) next(new AppError('Please provide your email', 400));

  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError('User with that email is not found', 404));

  const token = user.createResetToken();
  // exclude passwordConfirmation requirement
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`;

  try {
    const options = getMessageOptions(email, url);
    await sendEmail(options);

    res.status(200).json({
      status: 'success',
      message: 'A reset password token has been sent to your email.'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    next(new AppError('Error when sending email. Try again later.', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;
  const { password, passwordConfirmation } = req.body;

  if (!resetToken) next(new AppError('No reset token is provided', 404));

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) next(new AppError('Token is invalid or expired!', 400));

  user.password = password;
  user.passwordConfirmation = passwordConfirmation;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = createToken(user._id);
  sendToken(token, res, 200);
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
