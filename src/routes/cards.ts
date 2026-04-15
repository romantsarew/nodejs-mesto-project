import { Router } from 'express';
import {
  createCard, deleteCard, getCards, addLike, removeLike,
} from '../controllers/cards';

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

export default router;
