const Card = require('../models/card');
const ErrorCodeBadRequest = require('../errors/ErrorCodeBadRequest');
const ErrorCodeBanned = require('../errors/ErrorCodeBanned');
const ErrorCodeNotFound = require('../errors/ErrorCodeNotFound');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ErrorCodeBadRequest('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail(() => {
      throw new ErrorCodeNotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      } else {
        throw new ErrorCodeBanned('В доступе отказано');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new ErrorCodeNotFound('Передан несуществующий _id карточки');
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      // if (err.name === 'ValidationError' || err.name === 'CastError') {
      if (err.name === 'CastError') {
      //   throw new ErrorCodeBadRequest('Переданы некорректные данные для постановки лайка');
      // } else if (err.message === 'NotFound') {
      //   throw new ErrorCodeNotFound('Передан несуществующий _id карточки');
        next(new ErrorCodeBadRequest('Переданы некорректные данные для постановки лайка'));
      }
      // })
      // .catch(next);
      if (err.message === 'NotFound') {
        next(new ErrorCodeNotFound('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new ErrorCodeNotFound('Передан несуществующий _id карточки');
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      // if (err.name === 'ValidationError' || err.name === 'CastError') {
      if (err.name === 'CastError') {
      //   throw new ErrorCodeBadRequest('Переданы некорректные данные для снятия лайка');
      // } else if (err.message === 'NotFound') {
      //   throw new ErrorCodeNotFound('Передан несуществующий _id карточки');
        next(new ErrorCodeBadRequest('Переданы некорректные данные для снятия лайка'));
      }
      // })
      // .catch(next);
      if (err.message === 'NotFound') {
        next(new ErrorCodeNotFound('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
