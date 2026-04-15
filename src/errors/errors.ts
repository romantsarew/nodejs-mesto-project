enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message = 'Некорректные данные') {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Необходима авторизация') {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = 'Недостаточно прав') {
    super(message);
    this.statusCode = HttpStatus.FORBIDDEN;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Ресурс не найден') {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message = 'Ресурс уже существует') {
    super(message);
    this.statusCode = HttpStatus.CONFLICT;
  }
}
