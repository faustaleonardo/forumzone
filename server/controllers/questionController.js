const Question = require('./../models/questionModel');
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handleFactory');

exports.setUserId = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

exports.createQuestion = createOne(Question);
exports.getAllQuestions = getAll(Question);
exports.getQuestion = getOne(Question);
exports.updateQuestion = updateOne(Question);
exports.deleteQuestion = deleteOne(Question);
