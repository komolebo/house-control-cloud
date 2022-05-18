import {IsEmail, IsNotEmpty, IsPhoneNumber, MinLength} from "class-validator";

export class UserDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    @IsPhoneNumber()
    readonly phone: string;
}

export class UserPwdDto {
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}