const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const ErrorCodeAuth = require('../errors/ErrorCodeAuth');

// описание схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Поле с именем не может быть пустым'],
    minlength: [2, 'Минимальная длина поля с именем не может быть короче двух символов'],
    maxlength: [30, 'Максимальная длина поля с именем не может быть длиннее 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    // required: [true, 'Поле с информацией не может быть пустым'],
    minlength: [2, 'Минимальная длина поля с информацией не может быть короче двух символов'],
    maxlength: [30, 'Максимальная длина поля с информацией не может быть длиннее 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    // validate: {
    //   validator: (v) => /https?:/.test(v),
    //   message: 'Некорректный URL',
    // },
    validate: {
      validator: (url) => isUrl(url),
      message: 'Некорректный адрес URL',
    },
    // required: [true, 'Ссылка на аватар обязательна'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Некорректый адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorCodeAuth('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorCodeAuth('Неправильная почта или пароль'));
          }
          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
