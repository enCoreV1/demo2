const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
// const { ERROR_CODE_CAST } = require('../utils/errors');
const ErrorCodeNotFound = require('../errors/ErrorCodeNotFound');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new ErrorCodeNotFound('Запрашиваемая страница не существует'));
});

module.exports = router;
