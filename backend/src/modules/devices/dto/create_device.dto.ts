import {IsNotEmpty} from "class-validator";

export class Create_deviceDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly hex: string;

    @IsNotEmpty()
    readonly ip: string;

    readonly version: string;
}