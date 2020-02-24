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
  req.body.solvedByUser = comment.user._id;

  next();
});

exports.createQuestion = createOne(Question);
exports.getAllQuestions = getAll(Question);
exports.getQuestion = getOne(Question, {
  path: 'comments',
  select: 'user comment -question'
});
exports.updateQuestion = updateOne(Question);
exports.deleteQuestion = deleteOne(Question);

exports.setSolved = (req, res, next) => {
  req.solved = true;
  next();
};

exports.setUnsolved = (req, res, next) => {
  req.solved = false;
  next();
};

exports.getAllQuestionsWithStatus = catchAsync(async (req, res, next) => {
  const status = req.solved ? { $ne: null } : null;
  const docs = await Question.find({ solvedByUser: status });

  res.status(200).send({
    status: 'success',
    results: docs.length,
    data: {
      data: docs
    }
  });
});
