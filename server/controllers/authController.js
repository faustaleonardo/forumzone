const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirmation } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirmation
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
