import {IsNotEmpty} from "class-validator";
import {NotificationTypes} from "../messages/notification.types";

export class CreateNotification_Dto {
    @IsNotEmpty()
    readonly msgType: NotificationTypes;

    @IsNotEmpty()
    readonly targetUserId: number;

    readonly SourceUserId: string;
}

