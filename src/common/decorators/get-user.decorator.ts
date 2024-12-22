import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/features/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    return ctx.switchToHttp().getRequest().user;
  },
);
