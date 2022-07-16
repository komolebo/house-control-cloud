import {CreateNotification_Dto} from "../../notification/dto/create_notification__dto";

export enum THistoryMsgType {
    Devices,
    Account,
    Notification,
    None,
    TYPE_NUMBER
}


export interface CreateHistoryItem_Dto {
    type: string;

    text: string;

    uId?: string;

    devId?: string;
}