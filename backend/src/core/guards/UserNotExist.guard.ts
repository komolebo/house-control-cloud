import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "../../modules/users/user.entity";

@Injectable()
export class UserNotExistGuard implements CanActivate {
    constructor(@InjectModel(Users) private userRepository: typeof Users) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const emailExist = await this.userRepository.findOne({where: {email: request.body.email}});
        if (emailExist) {
            throw new ForbiddenException('This email already exists');
        }

        const loginExist = await this.userRepository.findOne({where: {login: request.body.login}})
        if (loginExist) {
            throw new ForbiddenException('This login already exists');
        }

        return true;
    }
}