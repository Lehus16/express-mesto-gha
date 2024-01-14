/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const winston = require('winston');
const expressWinston = require('express-winston');
// Логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'requests.log',
    }),
  ],
  format: winston.format.json(),
});
// Логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'errors.log',
    }),
  ],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
