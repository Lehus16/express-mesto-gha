const Statuses = require('../utils/codeStatus');

module.exports = (err, req, res, next) => {
  res.status(err.statusCode).send({
    message: err.statusCode === Statuses.SERVER_ERROR ? 'Ошибка на стороне сервера' : err.message,
  });
  return next();
};
