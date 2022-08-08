import {IsNotEmpty} from "class-validator";
import {ENotificationSeverity, ENotificationTypes} from "../messages/ENotificationTypes";

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

    readonly sourceUserId?: number; // filter criteria // to rename it later to targetUserId
    readonly sourceUserName?: string;
}

