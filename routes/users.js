const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  findUser,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const {
  // validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../middlewares/validation');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает пользователя по _id
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  findUser,
);

// возвращает текущего пользователя
router.get('/me', getCurrentUser);

// обновляет профиль
router.patch('/me', validationUpdateUser, updateUserProfile);

// обновляет аватар
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);

module.exports = router;
