import {IsNotEmpty} from "class-validator";

export class TokenPasswordDto {
    @IsNotEmpty()
    token: string;
}