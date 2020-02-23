const Comment = require('./../models/commentModel');
const catchAsync = require('./../utils/catchAsync');

const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handleFactory');

const { hasPermission } = require('./authController');

exports.hasPermission = hasPermission(Comment);

exports.setUserQuestionId = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.question) req.body.question = req.params.questionId;

  next();
});

exports.createComment = createOne(Comment);
exports.getAllComments = getAll(Comment);
exports.getComment = getOne(Comment);
exports.updateComment = updateOne(Comment);
exports.deleteComment = deleteOne(Comment);
