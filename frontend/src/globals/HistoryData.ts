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

export type IHistoryItem = {
    id: number,
    type: string,
    createdAt: Date,
    text: string,
    devId?: string;
    uId?: string;
}


export function getIndexesFromArray(arr: Array<IHistoryItem>): Array<number> {
    return arr.map((el, i) => i)
}
export function applyTypeFilter(indArr: Array<number>,
                                arrData: Array<IHistoryItem>,
                                type: string) {
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
        words.forEach(word => {
            if (word.includes(BOARD_FILTER_RESERV_WORD)) {
                const devId = word.split(BOARD_FILTER_RESERV_WORD)[1]
                matchAll &&= (devId === arrData[ind].devId);
            } else if (word.includes(USER_FILTER_RESERV_WORD)) {
                const uId = word.split(USER_FILTER_RESERV_WORD)[1];
                matchAll &&= (uId === arrData[ind].uId)
            }
            else {
                matchAll &&= arrData[ind].text.toLowerCase().includes(word.toLowerCase())
            }
        })
        return matchAll ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyDateFromFilter(indArr: Array<number>,
                                    arrData: Array<IHistoryItem>,
                                    dateFrom: Date) {
    return indArr.map(ind => {
        return arrData[ind].createdAt >= dateFrom ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyDateToFilter(indArr: Array<number>,
                                  arrData: Array<IHistoryItem>,
                                  dateTo: Date) {
    return indArr.map(ind => {
        console.log("date: ", arrData[ind].createdAt.toTimeString());
        console.log("dateTo: ", dateTo.toTimeString());
        return arrData[ind].createdAt <= dateTo ? ind : -1
    }).filter(newInd => newInd !== -1)
}


export const historyData: Array<IHistoryItem> = [
    // {
    //     type: THistoryMsgType.Account,
    //     text: "`You` registered into HomeNet system",
    //     date: new Date(),
    // },
    // {
    //     type: THistoryMsgType.Account,
    //     text: "`You` logged into HomeNet system",
    //     date: new Date(),
    // },
    // {
    //     type: THistoryMsgType.Account,
    //     text: "`You` changed your credentials",
    //     date: new Date(),
    // },
    // {
    //     type: THistoryMsgType.Devices,
    //     text: "User `Svetik moi Svetlana` connects to board `Sofia Borshchaga`",
    //     date: new Date(2021, 9, 30),
    //     uId: `Svetik moi Svetlana`,
    //     devId: 'Sofia Borshchaga',
    // },
    // {
    //     type: THistoryMsgType.Devices,
    //     text: "User `Svetik moi Svetlana` changed configuration of the board `Sofia Borshchaga`",
    //     date: new Date(2021, 9, 30),
    //     uId: `Svetik moi Svetlana`,
    //     devId: 'Sofia Borshchaga',
    // },
    // {
    //     type: THistoryMsgType.Notification,
    //     date: new Date(2020, 2, 3),
    //     text: "You invited the User `Svetik moi Svetlana` into board `Random` as Guest",
    //     devId: 'Random',
    //     uId: `Svetik moi Svetlana`
    // },
    // {
    //     type: THistoryMsgType.Notification,
    //     date: new Date(2020, 2, 3),
    //     text: "You lost an access into the board `Random` as Guest",
    //     devId: "Random",
    // },
    // {
    //     type: THistoryMsgType.Notification,
    //     date: new Date(2020, 1, 3),
    //     text: "You were invited into the board `Random` as Guest",
    //     devId: "Random",
    // },
    // {
    //     type: THistoryMsgType.Notification,
    //     date: new Date(2010, 1, 3),
    //     text: "Your subscription is expired",
    // },
]

export const BOARD_FILTER_RESERV_WORD = "board: "
export const USER_FILTER_RESERV_WORD = "user: "
export const HISTORY_DISPLAY_INITIAL_REC_NUM = 100;
export const HISTORY_DB_SYNC_MORE_RATE = 2 // trice more messages to sync
export const HISTORY_MSG_TYPES = [
    THistoryMsgType[THistoryMsgType.Devices],
    THistoryMsgType[THistoryMsgType.Account],
    THistoryMsgType[THistoryMsgType.Notification],
    THistoryMsgType[THistoryMsgType.None]]
;

