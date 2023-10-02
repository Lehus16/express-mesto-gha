// eslint-disable-next-line import/no-extraneous-dependencies
const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const Codes = require('../utils/codeStatus');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(() => res.status(Codes.SERVER_ERROR).send({ message: 'Что-то не так с сервером' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(Codes.CREATED).send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(Codes.BAD_REQUEST).send({ message: 'Неккоректные данные при создании карточки' });
      }
      return res.status(Codes.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId).orFail(new Error('NotFound'))
    .then((card) => res.status(Codes.OK).send(card))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Codes.NOT_FOUND).send({ message: 'Несуществующий _id карточки' });
      }
      if (error instanceof CastError) {
        return res.status(Codes.BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(Codes.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(Codes.OK).send(card))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Codes.NOT_FOUND).send({ message: 'Несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(Codes.BAD_REQUEST).send({ message: 'Неккоректные данные' });
      }
      return res.status(Codes.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};

module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(Codes.OK).send(card))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Codes.NOT_FOUND).send({ message: 'Несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(Codes.BAD_REQUEST).send({ message: 'Неккоректные данные' });
      }
      return res.status(Codes.SERVER_ERROR).send({ message: 'Что-то не так с сервером' });
    });
};
