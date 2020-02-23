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

bookmarkSchema.index({ question: 1, user: 1 }, { unique: true });

const bookmarkModel = mongoose.model('Bookmark', bookmarkSchema);

module.exports = bookmarkModel;
