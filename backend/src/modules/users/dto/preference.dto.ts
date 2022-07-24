import {IsNotEmpty, MinLength} from "class-validator";



export class PreferenceDto {
    // @IsNotEmpty()
    phone_verified?: boolean;
    // @IsNotEmpty()
    email_verified?: boolean;
    // @IsNotEmpty()
    dark_mode?: boolean;

    profile_photo?: string;
}