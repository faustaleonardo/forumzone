const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  comment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

voteSchema.index({ comment: 1, user: 1 }, { unique: true });

voteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'comment',
    select: 'comment -question'
  });

  next();
});

const voteModel = mongoose.model('Vote', voteSchema);

module.exports = voteModel;
