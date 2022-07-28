import {IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, MinLength} from "class-validator";

export class FullUserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    // // @IsPhoneNumber()
    // readonly phone?: string;

    @IsNotEmpty()
    readonly full_name: string;

    @IsNotEmpty()
    readonly login: string;
}

export class UserDto {
    @IsNotEmpty()
    readonly login: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}

export class UpdateUserInfoDto {
    full_name?: string;
    email?: string;
    phone?: string;
}

export class UserPwdDto {
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}