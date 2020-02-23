const Vote = require('./../models/voteModel');
const catchAsync = require('./../utils/catchAsync');
const Comment = require('./../models/commentModel');

const {
  createOne,
  getAll,
  getOne,
  deleteOne,
  checkIfDocExist
} = require('./handleFactory');

const { hasPermission } = require('./authController');

exports.hasPermission = hasPermission(Vote);

exports.checkIfCommentExist = checkIfDocExist(Comment);

exports.setUserCommentId = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.comment) req.body.comment = req.params.commentId;

  next();
});

exports.createVote = createOne(Vote);
exports.getAllVotes = getAll(Vote);
exports.getVote = getOne(Vote);
exports.deleteVote = deleteOne(Vote);
