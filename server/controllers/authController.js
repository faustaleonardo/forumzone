const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirmation
    });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};
