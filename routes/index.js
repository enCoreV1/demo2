const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { ERROR_CODE_CAST } = require('../utils/errors');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res.status(ERROR_CODE_CAST).send({ message: 'Сервер не найден' });
});

module.exports = router;
