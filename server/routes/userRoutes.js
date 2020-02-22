const express = require('express');

const router = express.Router();

const {
  signup,
  login,
  forgetPassword,
  resetPassword
} = require('../controllers/authController');
const { getUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

router.route('/:id').get(getUser);

module.exports = router;
