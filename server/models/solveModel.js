const mongoose = require('mongoose');

const solveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Types.ObjectId,
    ref: 'Question'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const solveModel = mongoose.model('Solve', solveSchema);

module.exports = solveModel;
