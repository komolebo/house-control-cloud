import {IsNotEmpty} from "class-validator";
import {ENotificationSeverity, ENotificationTypes} from "../messages/ENotificationTypes";

export class CreateNotification_Dto {
    @IsNotEmpty()
    readonly msgType: ENotificationTypes;

    @IsNotEmpty()
    readonly severity: ENotificationSeverity;

    readonly sourceUserId?: string;
}

