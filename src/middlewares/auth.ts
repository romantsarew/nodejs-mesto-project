import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errors';

const JWT_SECRET = 'super-strong-secret';

export interface JwtPayloadWithId extends JwtPayload {
  _id: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayloadWithId;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
    (req as AuthRequest).user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};
