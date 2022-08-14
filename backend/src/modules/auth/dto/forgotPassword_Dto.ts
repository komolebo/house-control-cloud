import {IsEmail, IsNotEmpty} from "class-validator";
import {Transform} from "class-transformer";

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(param => param.value.toLowerCase())
    email: string
}