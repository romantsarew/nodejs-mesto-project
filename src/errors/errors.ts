export class BadRequestError extends Error {
  statusCode: number;

  constructor(message = 'Некорректные данные') {
    super(message);
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Необходима авторизация') {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = 'Недостаточно прав') {
    super(message);
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Ресурс не найден') {
    super(message);
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message = 'Ресурс уже существует') {
    super(message);
    this.statusCode = 409;
  }
}
