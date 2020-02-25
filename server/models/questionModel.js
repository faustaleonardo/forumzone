const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide your title'],
      minlength: [8, 'Your title must be longer than 8 characters'],
      maxlength: [70, 'Your title must not be longer than 70 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide your content'],
      minlength: [8, 'Your title must be longer than 8 characters']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Question must belong to a user']
    },
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
      }
    ],
    solvedByUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    active: {
      type: Boolean,
      default: true
    },
    views: {
      Type: Number,
      default: 0
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

questionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'solvedByUser',
    select: 'name photo jobs'
  })
    .populate({
      path: 'user',
      select: 'name photo jobs'
    })
    .populate({
      path: 'comments',
      select: 'comment user'
    });

  next();
});

const questionModel = mongoose.model('Question', questionSchema);

module.exports = questionModel;
