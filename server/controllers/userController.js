const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const { getOne, getAll } = require('./handleFactory');

const filter = (obj, ...fields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.getUser = getOne(User, {
  path: 'solveQuestions',
  select: 'title content -solvedByUser'
});
exports.getAllUsers = getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredObj = {
    ...filter(
      req.body,
      'name',
      'email',
      'photo',
      'jobs',
      'accessibility',
      'age'
    ),
    updatedAt: Date.now()
  };

  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, filteredObj, {
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

  await User.findByIdAndUpdate(_id, { active: false, updatedAt: Date.now() });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
