import {IsNotEmpty} from "class-validator";

export class Create_deviceDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly hex: string;
}