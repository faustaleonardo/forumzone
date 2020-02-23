const Question = require('./../models/questionModel');
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

exports.createQuestion = createOne(Question);
exports.getAllQuestions = getAll(Question);
exports.getQuestion = getOne(Question);
exports.updateQuestion = updateOne(Question);
exports.deleteQuestion = deleteOne(Question);
