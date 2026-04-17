import { JwtPayloadWithId } from '../../middlewares/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadWithId;
    }
  }
}

export {};
