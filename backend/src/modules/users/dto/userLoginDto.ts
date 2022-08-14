import {IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, MinLength} from "class-validator";
import {Transform} from "class-transformer";

export class FullUserDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(param => param.value.toLowerCase())
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    // // @IsPhoneNumber()
    // readonly phone?: string;

    @IsNotEmpty()
    readonly full_name: string;

    @IsNotEmpty()
    @Transform(param => param.value.toLowerCase())
    readonly login: string;
}

export class UserLoginDto {
    @IsNotEmpty()
    @Transform(param => param.value.toLowerCase())
    readonly login: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}

export class UpdateUserInfoDto {
    full_name?: string;
    @Transform(param => param.value.toLowerCase())
    email?: string;
    phone?: string;
}

export class UserPwdDto {
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}