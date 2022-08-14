import {Controller, Body, Post, UseGuards, Param, Patch, ValidationPipe, Get, UsePipes} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserLoginDto, FullUserDto, UserPwdDto} from '../users/dto/userLoginDto';
import {UserNotExistGuard} from "../../core/guards/UserNotExist.guard";
import {AuthGuard} from "@nestjs/passport";
import {ForgotPasswordDto} from "./dto/forgotPassword_Dto";
import {ChangePasswordDto} from "./dto/changePasswordDto";
import {TokenPasswordDto} from "./dto/tokenPasswordDto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @UsePipes(new ValidationPipe({transform: true}))
    @Post('login')
    async login(@Body() user: UserLoginDto) {
        return await this.authService.login(user.login, user.password);
    }

    @UseGuards(UserNotExistGuard)
    @UsePipes(new ValidationPipe({transform: true}))
    @Post('signup')
    async signUp(@Body() user: FullUserDto) {
        return await this.authService.create(user);
    }

    @UsePipes(new ValidationPipe({transform: true}))
    @Post('forgot')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
        return this.authService.forgot(forgotPasswordDto);
    }

    @Post('isToken')
    async isTokenValid(@Body() tokenPasswordDto: TokenPasswordDto) {
        return {"valid": await this.authService.isTokenValid(tokenPasswordDto)}
    }

    @Patch('change')
    // @UseGuards(AuthGuard())
    async changePassword(@Body() changePasswordDto: ChangePasswordDto){
        return this.authService.changePassword(changePasswordDto);
    }
}