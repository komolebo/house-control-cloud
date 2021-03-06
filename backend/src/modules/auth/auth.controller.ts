import {Controller, Body, Post, UseGuards, Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserDto, FullUserDto, UserPwdDto} from '../users/dto/user.dto';
import {UserNotExistGuard} from "../../core/guards/UserNotExist.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    async login(@Body() user: UserDto) {
        return await this.authService.login(user.login, user.password);
    }

    @UseGuards(UserNotExistGuard)
    @Post('signup')
    async signUp(@Body() user: FullUserDto) {
        return await this.authService.create(user);
    }

    @Post('pwd/:id')
    async updateUserPwd(@Param('id') userId: number,
                        @Body() passDto: UserPwdDto) {
        return await this.authService.updatePwd(userId, passDto);
    }
}