const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const router = require('./routes/index');
const Statuses = require('./utils/codeStatus');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '651a9f496c1c265b24b75715',
  };
  next();
});

app.use(router);
app.use('*', (req, res) => res.status(Statuses.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' }));

async function init() {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);

  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
}

init();
