// eslint-disable-next-line import/no-extraneous-dependencies
const { ValidationError } = require('mongoose').Error;
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../utils/jwt');

const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const MongoDuplicateConflict = require('../errors/mongoDuplicate');
const Statuses = require('../utils/codeStatus');

const SAULT_ROUNDS = 10;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SAULT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(Statuses.CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((error) => {
      if (error.code === Statuses.MONGO_DUPLICATE) {
        next(new MongoDuplicateConflict('Пользователь с таким email уже существует'));
      } else if (error instanceof ValidationError) {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(Statuses.OK_REQUEST).send(users))
    .catch(next);
};

const getUserById = (req, res, userData, next) => {
  User.findById(userData)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      next(error);
    });
};

module.exports.getUser = (req, res, next) => {
  const userData = req.params.userId;
  getUserById(req, res, userData, next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const userData = req.user._id;
  getUserById(req, res, userData, next);
};

const updateUser = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Некорректные данные при обновлении данных профиля'));
      } else {
        next(error);
      }
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
