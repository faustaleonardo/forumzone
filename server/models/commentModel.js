const mongoose = require('mongoose');
const Vote = require('./voteModel');
const Question = require('./questionModel');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    question: {
      type: mongoose.Schema.ObjectId,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// delete votes associated with the comment
commentSchema.pre(/^findOneAndDelete/, async function(next) {
  this.c = await this.findOne();
  next();
});
commentSchema.post(/^findOneAndDelete/, async function() {
  await Vote.deleteMany({ comment: this.c._id });
});

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo jobs'
  });
  // creating conflict with questionModel
  // .populate({
  //   path: 'question',
  //   select: 'title -user'
  // });

  next();
});

commentSchema.pre('save', async function(next) {
  await Question.findByIdAndUpdate(this.question, {
    $push: { comments: this._id }
  });
  next();
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
