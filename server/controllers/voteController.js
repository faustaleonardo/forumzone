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

exports.getVotesStats = catchAsync(async (req, res, next) => {
  const stats = await Vote.aggregate([
    {
      $group: {
        _id: '$comment',
        numVoted: { $sum: 1 }
      }
    },
    {
      $sort: { numVoted: -1 }
    }
  ]);

  const users = await Promise.all(
    stats.map(async el => {
      const comment = await Comment.findById(el._id);
      const { user } = comment;

      return {
        user: {
          data: user._doc,
          numVoted: el.numVoted
        }
      };
    })
  );

  const usersObj = {};
  users.forEach(el => {
    const userId = el.user.data._id;
    const eachUser = usersObj[userId];

    if (!eachUser) usersObj[userId] = el;
    else eachUser.user.numVoted += el.user.numVoted;
  });

  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: {
      usersObj
    }
  });
});
