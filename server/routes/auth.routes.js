const express = require("express");
const router = express.Router({ mergeParams: true });
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const tokenService = require("../services/token.service");
const { generateUserData } = require("../utils/helpers");
const ERRORS = require("../utils/errorCodes");
const { validatorConfig } = require("../common/validatorConfig");
const { buildValidators } = require("../utils/buildValidators");
const validate = require("../middleware/validateMiddleware");
const { AppError } = require("../utils/appError");

const signUpValidator = buildValidators(validatorConfig, [
  "email",
  "password",
  "name",
  "about",
  "licence",
]);
const signInValidator = buildValidators(validatorConfig, ["email", "password"]);

router.post("/signUp", signUpValidator, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(ERRORS.EMAIL_EXISTS, 400);
    }
    const generated = generateUserData();
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      ...generated,
      ...req.body,
      password: hashedPassword,
      image: req.body.image?.trim() || generated.image,
    });

    const tokens = tokenService.generate({ _id: newUser._id });
    await tokenService.save(newUser._id, tokens.refreshToken);

    res.status(201).json({ ...tokens, userId: newUser._id });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/signWithPassword",
  signInValidator,
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        throw new AppError(ERRORS.EMAIL_NOT_FOUND, 404);
      }

      const isPasswordEqual = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordEqual) {
        throw new AppError(ERRORS.INVALID_PASSWORD, 400);
      }

      const tokens = tokenService.generate({ _id: existingUser._id });
      await tokenService.save(existingUser._id, tokens.refreshToken);

      res.status(200).json({ ...tokens, userId: existingUser._id });
    } catch (error) {
      next(error);
    }
  }
);

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString();
}

router.post("/token", async (req, res, next) => {
  try {
    const { refresh_token: refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(ERRORS.REFRESH_TOKEN_REQUIRED, 401);
    }

    const data = tokenService.validaterefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);

    if (isTokenInvalid(data, dbToken)) {
      throw new AppError(ERRORS.UNAUTHORIZED, 401);
    }

    const tokens = tokenService.generate({ _id: data._id });
    await tokenService.save(data._id, tokens.refreshToken);

    res.status(200).json({ ...tokens, userId: data._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
