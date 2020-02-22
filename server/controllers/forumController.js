const Forum = require('./../models/forumModel');
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require('./handleFactory');

exports.setUserId = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

exports.createForum = createOne(Forum);
exports.getAllForums = getAll(Forum);
exports.getForum = getOne(Forum);
exports.updateForum = updateOne(Forum);
exports.deleteForum = deleteOne(Forum);
