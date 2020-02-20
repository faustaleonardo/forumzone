class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'status';
    this.statusCode = statusCode;
    this.operational = true;
  }
}

module.exports = AppError;
