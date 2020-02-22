const express = require('express');

const router = express.Router();

const {
  signup,
  login,
  forgetPassword
} = require('../controllers/authController');
const { getUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);

router.route('/:id').get(getUser);

module.exports = router;
