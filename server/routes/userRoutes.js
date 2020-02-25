const express = require('express');

const router = express.Router();

const {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect
} = require('../controllers/authController');
const {
  getUser,
  getAllUsers,
  getMe,
  updateMe,
  deleteMe
} = require('../controllers/userController');

const questionRouter = require('./questionRoutes');
const commentRouter = require('./commentRoutes');
const bookmarkRouter = require('./bookmarkRoutes');
const voteRouter = require('./voteRoutes');

router.use('/:userId/questions', questionRouter);
router.use('/:userId/comments', commentRouter);
router.use('/:userId/bookmarks', bookmarkRouter);
router.use('/:userId/votes', voteRouter);

router.get('/me', protect, getMe, getUser);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);
router.get('/', protect, getAllUsers);

router.get('/logout', logout);
router.get('/:id', getUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;
