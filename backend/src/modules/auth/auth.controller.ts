import {Controller, Body, Post, UseGuards, Param, Patch, ValidationPipe, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserDto, FullUserDto, UserPwdDto} from '../users/dto/user.dto';
import {UserNotExistGuard} from "../../core/guards/UserNotExist.guard";
import {AuthGuard} from "@nestjs/passport";
import {ForgotPasswordDto} from "./dto/forgotPassword_Dto";
import {ChangePasswordDto} from "./dto/changePasswordDto";
import {TokenPasswordDto} from "./dto/tokenPasswordDto";

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

    @Post('forgot')
    async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto){
        return this.authService.forgot(forgotPasswordDto);
    }

    @Post('isToken')
    async isTokenValid(@Body() tokenPasswordDto: TokenPasswordDto) {
        return this.authService.isTokenValid(tokenPasswordDto)
    }

    @Patch('change')
    // @UseGuards(AuthGuard())
    async changePassword(@Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto){
        return this.authService.changePassword(changePasswordDto);
    }
}