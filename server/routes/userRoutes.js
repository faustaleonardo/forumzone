const express = require('express');

const router = express.Router();

const { signup, login } = require('../controllers/authController');
const { getUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);

router.route('/:id').get(getUser);

module.exports = router;
