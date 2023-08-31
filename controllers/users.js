// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCodeBadRequest = require('../errors/ErrorCodeBadRequest');
const ErrorCodeConflict = require('../errors/ErrorCodeConflict');
const ErrorCodeNotFound = require('../errors/ErrorCodeNotFound');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const findUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      throw new ErrorCodeNotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        //   throw new ErrorCodeBadRequest('Переданы некорректные данные');
        // } else if (err.message === 'NotFound') {
        //   throw new ErrorCodeNotFound('Пользователь по указанному _id не найден');
        next(new ErrorCodeBadRequest('Переданы некорректные данные'));
      }
      // })
      // .catch(next);
      if (err.message === 'NotFound') {
        next(new ErrorCodeNotFound('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    // .then((user) => res.status(201).send(user))
    .then(() => {
      res.status(201).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorCodeConflict('Пользователь уже существует'));
      }
    });
  //     .catch((e) => {
  //       if (e.code === 11000) {
  //         next(new ErrorCodeConflict('Email is already'));
  //       } else if (e instanceof mongoose.Error.ValidationError) {
  //         const message = Object.values(e.errors)
  //           .map((error) => error.message)
  //           .join('; ');
  //         next(new ErrorCodeBadRequest(message));
  //       } else {
  //         next(e);
  //       }
  //     });
  // };
  // .catch((err) => {
  //   // if (err.name === 'ValidationError') {
  //   //   throw new ErrorCodeBadRequest('Переданы некорректные данные при создании пользователя');
  //   // } else
  //   if (err.code === 11000) {
  //     next(new ErrorCodeConflict('Пользователь с таким email уже существует'));
  //   } else if (err instanceof mongoose.Error.ValidationError) {
  //     const message = Object.values(err.errors).map((error) => error.message).join('; ');
  //     next(new ErrorCodeBadRequest(message));
  //   } else {
  //     next(err);
  //   }
  // });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new ErrorCodeNotFound('Пользователь с указанным _id не найден');
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ErrorCodeBadRequest('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new ErrorCodeNotFound('Пользователь с указанным _id не найден');
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ErrorCodeBadRequest('Переданы некорректные данные при обновлении аватара');
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrorCodeNotFound('Пользователь не найден');
    })
    // .then((user) => res.status(200).send({ user }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorCodeBadRequest('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new ErrorCodeNotFound('Пользователь не найден');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'yandex-praktikum', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
  login,
};
