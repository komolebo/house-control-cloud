// import moment from 'react-moment'

import moment from "moment";

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
    console.log("getIndexesFromArray ", arr.length)
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
    return indArr.map(ind => {
        return arrData[ind].text.toLowerCase().includes(text.toLowerCase()) ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyDateFromFilter(indArr: Array<number>,
                                    arrData: Array<IHistoryItem>,
                                    dateFrom: Date) {
    return indArr.map(ind => {
        return moment(arrData[ind].createdAt) >= moment(dateFrom) ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyDateToFilter(indArr: Array<number>,
                                  arrData: Array<IHistoryItem>,
                                  dateTo: Date) {
    return indArr.map(ind => {
        return moment(arrData[ind].createdAt) <= moment(dateTo) ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export function applyIdFilters(indArr: Array<number>,
                               arrData: Array<IHistoryItem>,
                               uId: string,
                               devId: string) {
    return indArr.map(ind => {
        let uOk = true, dOk = true;
        if (uId) {
            uOk = arrData[ind].uId === uId;
        }
        if (devId) {
            dOk = arrData[ind].devId === devId;
        }
        return uOk && dOk ? ind : -1
    }).filter(newInd => newInd !== -1)
}
export const PAGE_ENTRIES_NUM = 100;
export const HISTORY_MSG_TYPES = [
    THistoryMsgType[THistoryMsgType.None],
    THistoryMsgType[THistoryMsgType.Devices],
    THistoryMsgType[THistoryMsgType.Account],
    THistoryMsgType[THistoryMsgType.Notification],
    ];

