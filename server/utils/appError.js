class AppError extends Error {
  constructor(status, statusCode = 500, isOperational = true) {
    super(status);
    this.status = status;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

module.exports = { AppError };
