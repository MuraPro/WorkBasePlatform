const express = require('express');
const Quality = require('../models/Quality');
const ERRORS = require('../utils/errorCodes');
const { AppError } = require('../utils/appError');

const router = express.Router({ mergeParams: true });

router.get('/', async (_, res, next) => {
  try {
    const qualities = await Quality.find();

    if (!qualities || qualities.length === 0) {
      throw new AppError(ERRORS.QUALITIES_NOT_FOUND, 404);
    }

    res.status(200).json(qualities);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
