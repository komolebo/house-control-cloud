import {Controller, Body, Post, UseGuards, Request, Put, Param} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {UserDto, UserPwdDto} from '../users/dto/user.dto';
import {DoesUserExist} from "../../core/guards/doesUserExist.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @UseGuards(DoesUserExist)
    @Post('signup')
    async signUp(@Body() user: UserDto) {
        return await this.authService.create(user);
    }

    @Post('pwd/:id')
    async updateUserPwd(@Param('id') userId: number,
                        @Body() passDto: UserPwdDto) {
        return await this.authService.updatePwd(userId, passDto);
    }
}