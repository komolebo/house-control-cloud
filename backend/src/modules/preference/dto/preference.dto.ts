import {IsNotEmpty, MinLength} from "class-validator";



export class PreferenceDto {
    // @IsNotEmpty()
    phone_verified?: boolean;
    // @IsNotEmpty()
    email_verified?: boolean;

    profile_photo?: string;

    profile_photo_id?: string;
}

export class UploadAvatarDto {
    avatar: File;
}