const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Types.ObjectId,
    ref: 'Question'
  },
  comment: {
    type: String,
    required: [true, 'Please provide your comment'],
    minlength: [true, 'Comment must be longer than 8 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
