const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
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
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Forum must belong to a user']
  }
});

const forumModel = mongoose.model('Forum', forumSchema);

module.exports = forumModel;
