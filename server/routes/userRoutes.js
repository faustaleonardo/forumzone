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
router.get('/:id', getUser);

router.use(protect);
router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/', getAllUsers);

module.exports = router;
