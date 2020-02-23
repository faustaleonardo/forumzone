const Bookmark = require('./../models/bookmarkModel');
const catchAsync = require('./../utils/catchAsync');

const { createOne, getAll, getOne, deleteOne } = require('./handleFactory');

const { hasPermission } = require('./authController');

exports.hasPermission = hasPermission(Bookmark);

exports.setUserQuestionId = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.question) req.body.question = req.params.questionId;

  next();
});

exports.createBookmark = createOne(Bookmark);
exports.getAllBookmarks = getAll(Bookmark);
exports.getBookmark = getOne(Bookmark);
exports.deleteBookmark = deleteOne(Bookmark);
