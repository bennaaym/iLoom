import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {EUserRole} from '@common/types';
import {USER_ROLES} from '@common/decorators';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      USER_ROLES,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true;

    const {currentUser} = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => currentUser.role === role);
  }
}
