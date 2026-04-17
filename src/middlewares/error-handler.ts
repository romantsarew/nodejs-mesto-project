import { ErrorRequestHandler } from 'express';
import { isCelebrateError } from 'celebrate';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { HttpStatus, DatabaseErrorCode } from '../errors/errors';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

const errorHandler: ErrorRequestHandler = (err: AppError, req, res, next) => {
  if (isCelebrateError(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: 'Некорректные данные',
    });
  }

  if (err instanceof MongooseError.ValidationError) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: 'Некорректные данные',
    });
  }

  if (err instanceof MongooseError.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: 'Некорректный идентификатор',
    });
  }

  if (err instanceof MongoServerError && err.code === DatabaseErrorCode.DUPLICATE_KEY) {
    return res.status(HttpStatus.CONFLICT).send({
      message: 'Ресурс уже существует',
    });
  }

  const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message } = err;

  return res.status(statusCode).send({
    message:
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
};

export default errorHandler;
