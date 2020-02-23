const catchAsync = require('./../utils/catchAsync');
const Question = require('./../models/questionModel');
const Comment = require('./../models/commentModel');
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handleFactory');
const { hasPermission } = require('./authController');

exports.setUserId = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

exports.hasPermission = hasPermission(Question);

exports.selectUser = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  req.body.solvedBy = comment.user;

  next();
});

exports.createQuestion = createOne(Question);
exports.getAllQuestions = getAll(Question);
exports.getQuestion = getOne(Question);
exports.updateQuestion = updateOne(Question);
exports.deleteQuestion = deleteOne(Question);
