const jwt = require('jsonwebtoken');
const ErrorCodeAuth = require('../errors/ErrorCodeAuth');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorCodeAuth('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'yandex-praktikum');
  } catch (err) {
    throw new ErrorCodeAuth('Необходима авторизация');
  }

  req.user = payload;
  next();
};
