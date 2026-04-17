import {
  Router, Request, Response, NextFunction,
} from 'express';
import { celebrate, Segments } from 'celebrate';
import userRouter from './users';
import cardRouter from './cards';
import { login, createUser } from '../controllers/users';
import auth from '../middlewares/auth';
import { NotFoundError } from '../errors/errors';
import {
  signInValidation,
  signUpValidation,
} from '../middlewares/validation';

const router = Router();

router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: signInValidation,
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: signUpValidation,
  }),
  createUser,
);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default router;
