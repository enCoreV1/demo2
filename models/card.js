const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

// описание схемы карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле с названием не может быть пустым'],
    minlength: [2, 'Минимальная длина поля с названием не может быть короче двух символов'],
    maxlength: [30, 'Максимальная длина поля с названием не может быть длиннее 30 символов'],
  },
  link: {
    type: String,
    // validate: {
    //   validator: (v) => /https?:/.test(v),
    //   message: 'Некорректный URL',
    // },
    validate: {
      validator: (url) => isUrl(url),
      message: 'Некорректный адрес URL',
    },
    required: [true, 'Ссылка на фото обязательна'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
