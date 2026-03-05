import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtRequest {
  user: {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
}

/**
 * Decorator to get current authenticated user from JWT token
 * Usage: @CurrentUser() user: User
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtRequest['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<JwtRequest>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
