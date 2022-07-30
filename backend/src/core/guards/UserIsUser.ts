import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';
import {Users} from "../../modules/users/user.entity";
import {AuthService} from "../../modules/auth/auth.service";
import {InjectModel} from "@nestjs/sequelize";

export const ENDPOINT_PARAM_USER_ID = 'user_id'

@Injectable()
export class UserIsUser implements CanActivate {
    constructor(@InjectModel(Users) private readonly userRepository: typeof Users,
                private readonly userService: UsersService,
                private authService: AuthService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userFromToken = this.authService.parseHeaders(request.headers.authorization)
        const paramUserId = request.params[ENDPOINT_PARAM_USER_ID];

        return userFromToken && paramUserId && this.userService.findOneById(userFromToken.id)
            .then((user: Users) => {
                let hasPermission = false;

                if (Number(user.id) === Number(userFromToken.id)) {
                    hasPermission = true;
                }
                return user && hasPermission;
            })
    }
}