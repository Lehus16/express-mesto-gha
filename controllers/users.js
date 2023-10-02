// eslint-disable-next-line import/no-extraneous-dependencies
const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const Statuses = require('../utils/codeStatus');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(Statuses.CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Неккоректные данные при создании пользователя' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(Statuses.OK).send(users))
    .catch(() => res.status(Statuses.SERVER_ERROR).send({ message: 'Что-то не так с сервером' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Statuses.OK).send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Пользователь по _id не найден' });
      }
      if (error instanceof CastError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Передан некорректный id' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};

const updateUser = (req, res, updateData) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Statuses.OK).send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Пользователь по _id не найден' });
      }
      if (error instanceof ValidationError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Некорректные данные при обновлении профиля' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};
