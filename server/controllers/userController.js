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

exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);

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
