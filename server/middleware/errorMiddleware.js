const { SERVER_ERROR } = require("../utils/errorCodes");

function errorMiddleware(err, req, res, next) {
  console.error(`[Error]: ${err.status || err.message}`);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status || SERVER_ERROR,
      statusCode: err.statusCode,
    });
  }

  res.status(500).json({
    status: SERVER_ERROR,
    statusCode: 500,
  });
}

module.exports = errorMiddleware;
