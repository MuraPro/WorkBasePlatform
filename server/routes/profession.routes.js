const express = require('express');
const Profession = require('../models/Profession');
const ERRORS = require('../utils/errorCodes');
const { AppError } = require('../utils/appError');

const router = express.Router({ mergeParams: true });

router.get('/', async (_, res, next) => {
  console.log('Запрос получен: /api/profession');

  try {
    const professions = await Profession.find();

    if (!professions || professions.length === 0) {
      throw new AppError(ERRORS.PROFESSIONS_NOT_FOUND, 404);
    }

    res.status(200).json(professions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
