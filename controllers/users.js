const User = require('../models/user');
const { ERROR_CODE_VALIDATION, ERROR_CODE_CAST, ERROR_CODE_SERVER } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(201).send(users))
    .catch(() => res.status(ERROR_CODE_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

const findUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_CODE_CAST).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_CODE_CAST).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_CODE_CAST).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
