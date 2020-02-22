const express = require('express');

const router = express.Router();

const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect
} = require('../controllers/authController');
const {
  getUser,
  getAllUsers,
  updateMe,
  deleteMe
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.get('/:id', getUser);
router.get('/', protect, getAllUsers);

module.exports = router;
