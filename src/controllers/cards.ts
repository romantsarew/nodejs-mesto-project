import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  HttpStatus,
} from '../errors/errors';

export const createCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: new Types.ObjectId(req.user!._id) })
    .then((card) => res.status(HttpStatus.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }

      return next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== req.user!._id) {
      throw new ForbiddenError('Недостаточно прав для удаления карточки');
    }

    return card.deleteOne().then(() => res.send({ data: card }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }

    next(err);
  });

export const addLike = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user!._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id карточки'));
    }

    return next(err);
  });

export const removeLike = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user!._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id карточки'));
    }

    return next(err);
  });
