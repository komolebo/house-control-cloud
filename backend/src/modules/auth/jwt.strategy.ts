import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
        // check if user in the token actually exist
        let user = await this.userService.findOneByEmail(payload.email);
        if (!user) {
            user = await this.userService.findOneByLogin(payload.login);
            if (!user) {
                throw new UnauthorizedException('You are not authorized to perform the operation');
            }
        }
        return payload;
    }
}