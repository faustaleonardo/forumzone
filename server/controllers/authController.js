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

const sendToken = (user, req, res, statusCode) => {
  const token = createToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user
    },
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

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirmation
  });

  sendToken(user, req, res, 200);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    next(new AppError('Please provide both email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPassword(password, user.password)))
    next(new AppError('Your email or password is incorrect', 401));

  sendToken(user, req, res, 200);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
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

  sendToken(user, req, res, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirmation } = req.body;
  if (!passwordCurrent || !password || !passwordConfirmation)
    next(
      new AppError(
        'Please provide your passwordCurrent, password and passwordConfirmation'
      )
    );

  const { _id } = req.user;
  const user = await User.findById(_id).select('+password');

  if (!(await user.verifyPassword(passwordCurrent, user.password))) {
    next(new AppError('Your password is incorrect', 401));
  }

  user.password = password;
  user.passwordConfirmation = passwordConfirmation;

  await user.save();
  sendToken(user, req, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(new AppError('You are not logged in. Please log in', 401));

  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(id);

  if (!user)
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );

  req.user = user;

  next();
});

exports.hasPermission = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc) return next(new AppError(`Can't find doc with that id`, 404));

    if (`${doc.user._id || doc.user}` !== `${req.user._id}`) {
      return next(
        new AppError('You do not have the permission to do this.', 401)
      );
    }

    next();
  });
};
