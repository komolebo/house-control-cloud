import {RoleValues} from "./roles__dto";
import {IsNotEmpty} from "class-validator";
import {Transform} from "class-transformer";

export class InviteUser_Dto {
    @IsNotEmpty()
    @Transform(param => param.value.toLowerCase())
    login: string;

    @IsNotEmpty()
    role: RoleValues
}