module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong.';

  return res.status(statusCode).json({
    status,
    message
  });
};
