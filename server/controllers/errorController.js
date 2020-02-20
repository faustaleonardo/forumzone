const AppError = require('../utils/appError');

const handleValidationErrorDB = error => {
  const message = Object.values(error.errors)
    .map(el => el.message)
    .join(', ');

  return new AppError(message, '400');
};

const sendErrDev = (error, res) => {
  const { status, statusCode, message, stack } = error;

  return res.status(statusCode).json({
    status,
    message,
    error,
    stack
  });
};

const sendErrProd = (error, res) => {
  const { statusCode, status, message } = error;

  return res.status(statusCode).json({
    status: status,
    message: message
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrProd(error, res);
  }
};
