const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

// парсим данные (собираем пакеты)
app.use(bodyParser.json());

// для защиты приложения
app.use(helmet());
app.disable('x-powered-by'); // отключает заголовок X-Powered-By

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true, // не работают в этой версии
  // useFindAndModify: false,  // не работают в этой версии
});

// добавляем в каждый запрос объект user
app.use((req, res, next) => {
  req.user = { _id: '64e9e7c253a660dd4737ff82' };
  next();
});

// роуты
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
