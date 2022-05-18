import {IsNotEmpty} from "class-validator";

export class CreateDevice_Dto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly hex: string;

    @IsNotEmpty()
    readonly ip: string;

    readonly version: string;
}

