const mongoose = require('mongoose');

// описание схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле с именем не может быть пустым'],
    minlength: [2, 'Минимальная длина поля с именем не может быть короче двух символов'],
    maxlength: [30, 'Максимальная длина поля с именем не может быть длиннее 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле с информацией не может быть пустым'],
    minlength: [2, 'Минимальная длина поля с информацией не может быть короче двух символов'],
    maxlength: [30, 'Максимальная длина поля с информацией не может быть длиннее 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => /https?:/.test(v),
      message: 'Некорректный URL',
    },
    required: [true, 'Ссылка на аватар обязательна'],
  },
}, {
  versionKey: '',
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
