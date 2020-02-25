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

const sendResponse = (res, docs) => {
  res.status(200).send({
    status: 'success',
    results: docs.length,
    data: {
      data: docs
    }
  });
};

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
exports.getQuestion = getOne(Question);
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

  sendResponse(res, docs);
});

exports.incrementView = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Question.findByIdAndUpdate(id, { $inc: { views: 1 } });

  next();
});

exports.getUnrepliedQuestions = catchAsync(async (req, res, next) => {
  const docs = await Question.find({ comments: { $size: 0 } });

  sendResponse(res, docs);
});

exports.getPopularThisWeekQuestions = catchAsync(async (req, res, next) => {
  const docs = await Question.aggregate([
    {
      $match: { comments: { $not: { $size: 0 } } }
    },
    {
      $group: {
        _id: { $isoWeek: '$createdAt' },
        questions: {
          $push: {
            _id: '$_id',
            title: '$title',
            user: '$user',
            createdAt: '$createdAt',
            weekNumber: { $isoWeek: '$createdAt' }
          }
        }
      }
    },
    {
      $addFields: {
        weekNumber: '$_id',
        thisWeekNumber: { $isoWeek: new Date() }
      }
    }
  ]);

  sendResponse(res, docs);
});
