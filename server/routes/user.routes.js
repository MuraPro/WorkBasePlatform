const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const ERRORS = require("../utils/errorCodes");
const { AppError } = require("../utils/appError");
const { validatorConfig } = require("../common/validatorConfig");
const { buildValidators } = require("../utils/buildValidators");
const validate = require("../middleware/validateMiddleware");

const updateUserValidator = buildValidators(validatorConfig, [
  "name",
  "email",
  "about",
]);

router.get("/", auth, async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new AppError(ERRORS.USERS_NOT_FOUND, 404);
    }
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:userId",
  auth,
  updateUserValidator,
  validate,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        throw new AppError(ERRORS.EMAIL_NOT_FOUND, 400);
      }

      if (userId === req.user._id) {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
          new: true,
        });
        res.send(updatedUser);
      } else {
        throw new AppError(ERRORS.UNAUTHORIZED, 400);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/:userId/like", auth, async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      throw new AppError(ERRORS.CANNOT_LIKE_YOURSELF, 400);
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      throw new AppError(ERRORS.USER_NOT_FOUND, 400);
    }

    const likedBy = user.likedBy.map(String);

    if (likedBy.includes(currentUserId.toString())) {
      throw new AppError(ERRORS.ALREADY_LIKED, 409);
    }

    user.likedBy.push(currentUserId);
    user.likesCount = user.likedBy.length;

    await user.save();

    res.status(200).json({ content: user });
  } catch (error) {
    next(error);
  }
});

router.post("/:userId/favorite", auth, async (req, res, next) => {
  try {
    const targetId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetId === currentUserId.toString()) {
      throw new AppError(ERRORS.CANNOT_FAVORITE_SELF, 400);
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new AppError(ERRORS.USER_NOT_FOUND, 400);
    }

    const index = currentUser.favorites
      .map(String)
      .indexOf(targetId.toString());

    if (index === -1) {
      currentUser.favorites.push(targetId);
    } else {
      currentUser.favorites.splice(index, 1);
    }

    await currentUser.save();

    res.status(200).json({ content: currentUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
