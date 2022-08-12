import {IsEmail, IsNotEmpty} from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    token: string

    @IsNotEmpty()
    password: string
}