/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const centralizedErrorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');
const NotFoundError = require('./errors/notFound');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errors());
app.use(centralizedErrorHandler);

async function init() {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
}

init();
