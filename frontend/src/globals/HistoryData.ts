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
export enum TFilterCriteria {
    By_user = 1,
    By_device = 2,
    Other_criteria = 4
}

export const HISTORY_MSG_TYPES = Array.from(Array(THistoryMsgType.TYPE_NUMBER).keys());

export type IHistoryItem = {
    type: THistoryMsgType,
    date: Date,
    text: string,
    devId?: string;
    uId?: string;
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
    const words: Array<string> = text.split('+')
    return indArr.map(ind => {
        let matchAll = true;
        words.forEach(word => { matchAll &&= arrData[ind].text.includes(word) })
        return matchAll ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyDateFromFilter(indArr: Array<number>,
                                    arrData: Array<IHistoryItem>,
                                    date: Date) {
    return indArr.map(ind => {
        return arrData[ind].date >= date ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyDateToFilter(indArr: Array<number>,
                                  arrData: Array<IHistoryItem>,
                                  date: Date) {
    return indArr.map(ind => {
        return arrData[ind].date <= date ? ind : -1
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
        text: "User `Svetik moi Svetlana` connects to board `Sofia Borshchaga`",
        date: new Date(2021, 9, 30),
        uId: `Svetik moi Svetlana`,
        devId: 'Sofia Borshchaga',
    },
    {
        type: THistoryMsgType.Devices,
        text: "User `Svetik moi Svetlana` changed configuration of the board `Sofia Borshchaga`",
        date: new Date(2021, 9, 30),
        uId: `Svetik moi Svetlana`,
        devId: 'Sofia Borshchaga',
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 2, 3),
        text: "You invited the User `Svetik moi Svetlana` into board `Random` as Guest",
        devId: 'Random',
        uId: `Svetik moi Svetlana`
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 2, 3),
        text: "You lost an access into the board `Random` as Guest",
        devId: "Random",
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2020, 1, 3),
        text: "You were invited into the board `Random` as Guest",
        devId: "Random",
    },
    {
        type: THistoryMsgType.Notification,
        date: new Date(2010, 1, 3),
        text: "Your subscription is expired",
    },
]