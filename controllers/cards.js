const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbiddenError');
const Statuses = require('../utils/codeStatus');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(Statuses.CREATED).send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(new NotFoundError('Несуществующий _id карточки'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
      return Card.deleteOne({ _id: cardId });
    })
    .then(() => res.status(Statuses.OK_REQUEST).send({ message: 'Карточка удалена' }))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Некорректный _id карточки'));
      } else {
        next(error);
      }
    });
};

const toggleCardLikes = (req, res, likesData, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    likesData,
    { new: true },
  )
    .orFail(new NotFoundError('Несуществующий _id карточки'))
    .then((card) => res.status(Statuses.OK_REQUEST).send(card))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Некорректные данные для постановки лайка'));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const likesData = { $addToSet: { likes: req.user._id } };
  toggleCardLikes(req, res, likesData, next);
};

module.exports.removeCardLike = (req, res, next) => {
  const likesData = { $pull: { likes: req.user._id } };
  toggleCardLikes(req, res, likesData, next);
};
