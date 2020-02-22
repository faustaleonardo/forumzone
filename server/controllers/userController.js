const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filter = (obj, ...fields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) next(new AppError(`Can't find user with that id`, 404));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).send({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filterObj = filter(
    req.body,
    'name',
    'email',
    'photo',
    'jobs',
    'accessibility'
  );

  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, filterObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
