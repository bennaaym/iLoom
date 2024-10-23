export {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {Injectable, NestMiddleware} from '@nestjs/common';
import {UserDocument} from '@modules/core/users/user.schema';
import {ExplicityAny, UserSession} from '@common/types';
import {UsersService} from '@modules/core/users';

declare global {
  namespace Express {
    interface Request {
      currentUser: UserDocument;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const {userId} = (req.session as ExplicityAny as UserSession) ?? {};
    if (userId) {
      const user = await this.usersService.findByIdentifier('id', userId);
      req.currentUser = user;
    }
    next();
  }
}
