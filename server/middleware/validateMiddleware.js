const { validationResult } = require("express-validator");
const { AppError } = require("../utils/appError");
const ERRORS = require("../utils/errorCodes");

function validate(req, _, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(ERRORS.VALIDATION_ERROR, 400));
  }
  next();
}

module.exports = validate;
