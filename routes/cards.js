const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
router.get('/', getCards);

// создаёт карточку
router.post('/', createCard);

// удаляет карточку по _id
router.delete('/:cardId', deleteCard);

// ставит лайк карточке
router.put('/:cardId/likes', likeCard);

// убирает лайк с карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
