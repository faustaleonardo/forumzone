const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return new AppError(`Can't find user with that id`, 404);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
