import { ErrorRequestHandler } from 'express';

enum HttpStatusCode {
  InternalServerError = 500,
}

interface AppError extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler = (err: AppError, req, res) => {
  const { statusCode = HttpStatusCode.InternalServerError, message } = err;

  res.status(statusCode).send({
    message: statusCode === HttpStatusCode.InternalServerError ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;
