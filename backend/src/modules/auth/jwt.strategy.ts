import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(Users) private userRepository: typeof Users) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
        // check if user in the token actually exist
        let user = await this.userRepository.findOne({where: {email: payload.email}});
        if (!user) {
            user = await this.userRepository.findOne({where: {login: payload.login}});
            if (!user) {
                throw new UnauthorizedException('You are not authorized to perform the operation');
            }
        }
        return payload;
    }
}