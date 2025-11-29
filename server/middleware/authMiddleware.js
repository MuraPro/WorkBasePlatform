const tokenService = require("../services/token.service");
const { AppError } = require("../utils/appError");
const ERRORS = require("../utils/errorCodes");

module.exports = (req, _, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(ERRORS.UNAUTHORIZED, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError(ERRORS.UNAUTHORIZED, 401);
    }

    const data = tokenService.validateAccess(token);
    if (!data) {
      throw new AppError(ERRORS.UNAUTHORIZED, 401);
    }

    req.user = data;
    next();
  } catch (error) {
    next(error);
  }
};
