import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';
import {
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
} from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: userIdValidation,
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: updateUserValidation,
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: updateAvatarValidation,
  }),
  updateUserAvatar,
);

export default router;
