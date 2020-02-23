const Question = require('./../models/questionModel');
const Comment = require('./../models/commentModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  checkIfUserMatch
} = require('./handleFactory');

exports.checkIfUserMatch = checkIfUserMatch(Comment);

exports.setUserQuestionId = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;
  const { _id } = req.user;

  if (!(await Question.findById(questionId))) {
    return next(new AppError(`Can't find question with that id`, 400));
  }

  req.body.user = _id;
  req.body.question = questionId;
  next();
});

exports.createComment = createOne(Comment);
exports.getAllComments = getAll(Comment);
exports.getComment = getOne(Comment);
exports.updateComment = updateOne(Comment);
exports.deleteComment = deleteOne(Comment);
