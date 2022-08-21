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
    YOU_GOT_ACCESS, // device name
    USER_GOT_ACCESS, // device name, object user name

    YOU_LOST_ACCESS, // device name
    USER_LOST_ACCESS, // device name, object user name

    YOU_ARE_MODIFIED, // device name, role name
    USER_IS_MODIFIED, // device name, object user name, role name

    ALL_USERS_CLEAR, // device name -> USER_LOST_ACCESS

    // with options //
    ACCEPT_USER_ADD,
    ACCEPT_USER_REMOVE,

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
