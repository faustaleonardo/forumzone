const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const bookmarkModel = mongoose.model('Bookmark', bookmarkSchema);

module.exports = bookmarkModel;
