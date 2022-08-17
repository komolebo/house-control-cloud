import {IsEmail, IsNotEmpty} from "class-validator";

export class CheckEmailActivationDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class ActivateAccountDto {
    @IsNotEmpty()
    token: string;
}