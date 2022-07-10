import {Notifications} from "../notification.entity";

export enum ENotificationSeverity {
    INFO,
    ACTION,
    ERROR
}

export enum ENotificationAction {
    Approve,
    Close,
}

export enum ENotificationTypes {
    // no choice //
    YOU_ARE_ADDED,
    DEVICE_ADDED,

    USER_REMOVED,
    YOU_LOST_ACCESS,

    // with options //
    ACCEPT_USER_ADD,
    ACCEPT_USER_REMOVE,

    YOU_ARE_INVITED,

    SUBSCRIPTION_EXPIRED,
    SUBSCRIPTION_PROLONGED,

}

interface IExplainMap {text: string, actions: string}

const NO_ACTION_STR = "";

const typeStr = (type: ENotificationTypes): string => {
    return ENotificationTypes[type];
}

export function ExplainNotificationMap(type: ENotificationTypes, dbObj: Notifications): IExplainMap {
    switch (type.toString()) {
        case typeStr(ENotificationTypes.YOU_ARE_ADDED):
            return {
                text: `You are now added to the device ${dbObj.deviceId}`,
                actions: NO_ACTION_STR,
            };
        case typeStr(ENotificationTypes.DEVICE_ADDED):
            return {
                text: "Device is successfully added",
                actions: "OK"
            };
        case typeStr(ENotificationTypes.ACCEPT_USER_ADD):
            return {
                text: "Please accept user adding",
                actions: "Accept",
            };
        case typeStr(ENotificationTypes.ACCEPT_USER_REMOVE):
            return {
                text: "Please accept user adding",
                actions: "Remove",
            };
        case typeStr(ENotificationTypes.SUBSCRIPTION_EXPIRED):
            return {
                text: "Your subscription is expired",
                actions: "Prolong",
            };
        case typeStr(ENotificationTypes.SUBSCRIPTION_PROLONGED):
            return {
                text: "Your subscription is prolonged",
                actions: NO_ACTION_STR,
            };
        case typeStr(ENotificationTypes.YOU_LOST_ACCESS):
            return {
                text: "You are now removed from the device",
                actions: NO_ACTION_STR,
            };

    }

    return {actions: NO_ACTION_STR, text: NO_ACTION_STR}
}
