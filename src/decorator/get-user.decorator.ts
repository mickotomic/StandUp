import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
