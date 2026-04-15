import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from '../errors/errors';
import { AuthRequest } from '../middlewares/auth';

const JWT_SECRET = 'super-strong-secret';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id пользователя'));
    }

    return next(err);
  });

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с таким email уже существует'),
        );
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }

      return next(err);
    });
};

export const updateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }

      return next(err);
    });
};

export const updateUserAvatar = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }

      return next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return next(err);
    });
};

export const getCurrentUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.send({ data: user });
  })
  .catch(next);
