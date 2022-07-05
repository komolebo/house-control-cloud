import {createParamDecorator, ExecutionContext, Logger} from '@nestjs/common';
//
// export const RoleDecor = createParamDecorator((data, req) => {
//     return req.user;
// });

var logger = new Logger("COMO");

export const RoleDecor = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        logger.error("I'm here")
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);