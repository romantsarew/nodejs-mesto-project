import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'super-strong-secret';

export interface JwtPayloadWithId extends JwtPayload {
  _id: string;
}

export interface AuthRequest extends Request {
  user: JwtPayloadWithId;
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
