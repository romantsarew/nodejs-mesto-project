import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  createCard, deleteCard, getCards, addLike, removeLike,
} from '../controllers/cards';
import {
  cardBodyValidation,
  cardIdValidation,
} from '../middlewares/validation';

const router = Router();

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: cardBodyValidation,
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    [Segments.PARAMS]: cardIdValidation,
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    [Segments.PARAMS]: cardIdValidation,
  }),
  addLike,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    [Segments.PARAMS]: cardIdValidation,
  }),
  removeLike,
);

export default router;
