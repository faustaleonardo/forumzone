const Solve = require('./../models/solveModel');
const Question = require('./../models/questionModel');

const {
  createOne,
  getAll,
  getOne,
  checkIfDocExist
} = require('./handleFactory');

const catchAsync = require('./../utils/catchAsync');

exports.checkIfQuestionExist = checkIfDocExist(Question);

exports.setUserQuestionId = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;
  const { _id } = req.user;

  req.body.user = _id;
  req.body.question = questionId;
  next();
});

exports.createSolve = createOne(Solve);
exports.getAllSolves = getAll(Solve);
exports.getSolve = getOne(Solve);
