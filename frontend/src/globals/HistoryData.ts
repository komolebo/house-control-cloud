import {TDevRole} from "./DeviceData";
// import moment from 'react-moment'
import moment from 'moment'
import {arrayBuffer} from "stream/consumers";

export enum THistoryMsgType {
    Devices,
    Account,
    Notification,
    None,
    TYPE_NUMBER
}

export const HISTORY_MSG_TYPES = Array.from(Array(THistoryMsgType.TYPE_NUMBER).keys());

export type IHistoryItem = {
    type: THistoryMsgType,
    date: Date,
    text: string,
    devId?: string;
    uId?: number;
}

export function getIndexesFromArray(arr: Array<IHistoryItem>): Array<number> {
    return arr.map((el, i) => i)
}
export function applyTypeFilter(indArr: Array<number>,
                                arrData: Array<IHistoryItem>,
                                type: THistoryMsgType) {
    return indArr.map(ind => {
        return arrData[ind].type === type ? ind : -1
    }).filter(newInd => newInd !== -1)
}

export function applyTextFilter(indArr: Array<number>,
                                arrData: Array<IHistoryItem>,
                                text: string) {
    return indArr.map(ind => {
        return arrData[ind].text.includes(text) ? ind : -1
    }).filter(newInd => newInd !== -1)
}

export const historyData: Array<IHistoryItem> = [
    {
        type: THistoryMsgType.Account,
        text: "`You` registered into HomeNet system",
        date: new Date(),
    },
    {
        type: THistoryMsgType.Account,
        text: "`You` logged into HomeNet system",
        date: new Date(),
    },
    {
        type: THistoryMsgType.Account,
        text: "`You` changed your credentials",
        date: new Date(),
    },
    {
        type: THistoryMsgType.Devices,
        text: "User `Svetik moi Svetlana` connects to board 'Sofia Borshchaga'",
        date: new Date(2021, 9, 30),
    },
    {
        type: THistoryMsgType.Devices,
        text: "User `Svetik moi Svetlana` changed configuration of the board 'Sofia Borshchaga'",
        date: new Date(2021, 9, 30),
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 2, 3),
        text: "You invited the User `Svetik moi Svetlana` into board 'Sofia Borshchaga' as Guest",
        devId: "0011AABB",
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 2, 3),
        text: "You lost an access into the board 'Sofia Borshchaga' as Guest",
        devId: "0011AABB",
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 1, 3),
        text: "You were invited into the board 'Sofia Borshchaga' as Guest",
        devId: "0011AABB",
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 1, 3),
        text: "Your subscription is expired",
    },
]