const AppError = require('../utils/appError');

const handleValidationErrorDB = error => {
  const message = Object.values(error.errors)
    .map(el => el.message)
    .join(', ');

  return new AppError(message, '400');
};

const handleDuplicateKeyErrorDB = error => {
  const duplicateKey = error.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate value: ${duplicateKey}. Please use another!`;
  return new AppError(message, '400');
};

const handleCastErrorDB = error => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, '400');
};

const handleTokenExpiredError = () => {
  const message = 'Your JWT token has expired. Please log in again.';
  return new AppError(message, '401');
};

const handleJsonWebTokenError = () => {
  const message = 'Invalid JWT token!';
  return new AppError(message, '401');
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

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.code === 11000) error = handleDuplicateKeyErrorDB(error);

    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();

    sendErrProd(error, res);
  }
};
