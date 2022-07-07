import {IsNotEmpty} from "class-validator";
import {ENotificationTypes} from "../messages/ENotificationTypes";

export class CreateNotification_Dto {
    @IsNotEmpty()
    readonly msgType: ENotificationTypes;

    @IsNotEmpty()
    readonly targetUserId: number;

    readonly SourceUserId: string;
}

