// import moment from 'react-moment'

export enum THistoryMsgType {
    Devices,
    Account,
    Notification,
    None,
    TYPE_NUMBER
}
export enum TFilterCriteria {
    By_user = 1,
    By_device = 2,
    Other_criteria = 4
}

export type IHistoryItem = {
    id: number,
    type: string,
    createdAt: Date,
    text: string,
    devId?: string;
    uId?: string;
}


export const PAGE_ENTRIES_NUM = 30;
export const HISTORY_MSG_TYPES = [
    THistoryMsgType[THistoryMsgType.None],
    THistoryMsgType[THistoryMsgType.Devices],
    THistoryMsgType[THistoryMsgType.Account],
    THistoryMsgType[THistoryMsgType.Notification],
    ];
export const DEFAULT_HISTORY_TYPE = THistoryMsgType[THistoryMsgType.None]
