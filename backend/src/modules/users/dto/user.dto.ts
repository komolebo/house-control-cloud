import {IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, MinLength} from "class-validator";

export class UserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    // // @IsPhoneNumber()
    // readonly phone?: string;
    //
    // // @IsNotEmpty()
    // readonly name?: string;
}

export class UserPwdDto {
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}