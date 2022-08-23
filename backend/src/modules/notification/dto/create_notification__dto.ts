import {IsNotEmpty} from "class-validator";

export class CreateNotification_Dto {
    @IsNotEmpty()
    readonly userId: number;

    @IsNotEmpty()
    readonly msgType: string;

    @IsNotEmpty()
    readonly severity: string;

    readonly text: string;

    readonly deviceId?: number; // filter criteria
    readonly deviceHex?: string;

    readonly objUserId?: number; // filter criteria // to rename it later to targetUserId
    readonly objUserName?: string;
}

