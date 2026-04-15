import { ErrorRequestHandler } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler = (err: AppError, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;
