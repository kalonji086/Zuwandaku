import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ApiKeyUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.apiKeyUser;
  },
);

