const Forum = require('./../models/forumModel');
const catchAsync = require('./../utils/catchAsync');

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
