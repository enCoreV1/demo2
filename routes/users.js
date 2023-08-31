const router = require('express').Router();
const {
  getUsers,
  // findUser,
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
// router.get('/:userId', validationUserId, findUser);

// возвращает текущего пользователя
router.get('/me', getCurrentUser);

// обновляет профиль
router.patch('/me', validationUpdateUser, updateUserProfile);

// обновляет аватар
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);

module.exports = router;
