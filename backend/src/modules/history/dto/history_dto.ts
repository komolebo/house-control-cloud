import {CreateNotification_Dto} from "../../notification/dto/create_notification__dto";
import {RoleValues} from "../../devices/dto/roles__dto";
import {IsDate, IsDefined, IsEnum, IsString, Matches} from "class-validator";
import {Transform} from "class-transformer";

export enum THistoryMsgType {
    Devices = "Devices",
    Account = "Account",
    Notification = "Notification",
    None = "None",
}


export interface CreateHistoryItem_Dto {
    type: string;
    text: string;
    uId?: string;
    devId?: string;
}

export class HistoryRetrieval_Dto {
    @IsDefined()
    limit: number;
    @IsDefined()
    offset: number;

    @IsEnum(THistoryMsgType)
    type: THistoryMsgType;

    @IsString()
    text: string;

    from: string;
    to: string;

    uId: string;
    devId: string;
}