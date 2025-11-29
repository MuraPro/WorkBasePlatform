const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/Comment");
const auth = require("../middleware/authMiddleware");
const { validatorConfig } = require("../common/validatorConfig");
const { buildValidators } = require("../utils/buildValidators");
const validate = require("../middleware/validateMiddleware");
const ERRORS = require("../utils/errorCodes");
const { AppError } = require("../utils/appError");

const createCommentValidator = buildValidators(validatorConfig, ["content"]);

router.get("/", auth, async (req, res, next) => {
  try {
    const { orderBy, equalTo } = req.query;
    let filter = {};

    if (orderBy && equalTo) {
      filter = { [orderBy]: equalTo };
    }

    const comments = await Comment.find(filter).sort({ created_at: 1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  auth,
  createCommentValidator,
  validate,
  async (req, res, next) => {
    try {
      const { content, pageId } = req.body;

      if (!pageId) {
        throw new AppError(ERRORS.VALIDATION_ERROR, 400);
      }

      const newComment = await Comment.create({
        content: content?.trim() || "",
        pageId,
        userId: req.user._id,
      });

      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:commentId", auth, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      throw new AppError(ERRORS.COMMENT_NOT_FOUND, 404);
    }

    if (existingComment.userId.toString() !== req.user._id) {
      throw new AppError(ERRORS.PERMISSION_DENIED, 403);
    }

    await existingComment.deleteOne();
    res.status(200).json({ message: "Комментарий успешно удалён" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
