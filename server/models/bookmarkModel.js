const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
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

const bookmarkModel = mongoose.model('Bookmark', bookmarkSchema);

module.exports = bookmarkModel;
