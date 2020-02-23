const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
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

const voteModel = mongoose.model('Solve', voteSchema);

module.exports = voteModel;
