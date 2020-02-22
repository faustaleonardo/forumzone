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
const { getUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);

router.route('/:id').get(getUser);

module.exports = router;
