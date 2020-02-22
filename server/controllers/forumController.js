const Forum = require('./../models/forumModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createForum = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { _id } = req.user;

  const forum = await Forum.create({ title, content, user: _id });

  res.status(200).json({
    status: 'success',
    data: {
      forum
    }
  });
});

exports.getAllForums = catchAsync(async (req, res, next) => {
  const forums = await Forum.find();

  res.status(200).json({
    status: 'success',
    results: forums.length,
    data: {
      forums
    }
  });
});

exports.getForum = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const forum = await Forum.findById(id);
  if (!forum) next(new AppError(`Can't find forum with that id`, 404));

  res.status(200).json({
    status: 'success',
    data: {
      forum
    }
  });
});

exports.updateForum = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const forum = await Forum.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      forum
    }
  });
});

exports.deleteForum = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Forum.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});
