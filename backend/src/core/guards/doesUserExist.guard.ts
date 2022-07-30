import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class UserDoesNotExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const emailExist = await this.userService.findOneByEmail(request.body.email);
        if (emailExist) {
            throw new ForbiddenException('This email already exists');
        }

        const loginExist = await this.userService.findOneByLogin(request.body.email)
        if (loginExist) {
            throw new ForbiddenException('This login already exists');
        }

        return true;
    }
}