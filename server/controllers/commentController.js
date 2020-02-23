const Comment = require('./../models/commentModel');

const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handleFactory');

exports.setUserQuestionId = (req, res, next) => {
  req.body.user = req.user._id;
  req.body.question = req.params.id;
  next();
};

exports.createComment = createOne(Comment);
exports.getAllComments = getAll(Comment);
exports.getComment = getOne(Comment);
exports.updateComment = updateOne(Comment);
exports.deleteComment = deleteOne(Comment);
