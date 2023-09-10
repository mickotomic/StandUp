import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await (super.canActivate(context) as Promise<boolean>);
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      return request.user.role === 'admin';
    }
    return false;
  }
}
