import {Notifications} from "../notification.entity";

export enum ENotificationSeverity {
    INFO = "INFO",
    ACTION = "ACTION",
    ERROR = "ERROR"
}

export enum ENotificationAction {
    Approve,
    Close,
}

export enum ENotificationTypes {
    // no choice //
    YOU_GOT_ACCESS = "YOU_GOT_ACCESS", // device name
    USER_GOT_ACCESS = "USER_GOT_ACCESS", // device name, object user name

    YOU_LOST_ACCESS = "YOU_LOST_ACCESS", // device name
    USER_LOST_ACCESS = "USER_LOST_ACCESS", // device name, object user name

    YOU_ARE_MODIFIED = "YOU_ARE_MODIFIED", // device name, role name
    USER_IS_MODIFIED = "USER_IS_MODIFIED", // device name, object user name, role name

    ALL_USERS_CLEAR = "ALL_USERS_CLEAR", // device name -> USER_LOST_ACCESS

    // with options //
    ACCEPT_USER_ADD = "ACCEPT_USER_ADD",
    ACCEPT_USER_REMOVE = "ACCEPT_USER_REMOVE",

    SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
    SUBSCRIPTION_PROLONGED = "SUBSCRIPTION_PROLONGED",

}

interface IExplainMap {text: string, actions: string}

const NO_ACTION_STR = "";

export function ExplainNotificationMap(type: ENotificationTypes, dbObj: Notifications): IExplainMap {
    switch (type) {
        case ENotificationTypes.ACCEPT_USER_ADD:
            return {
                text: "Please accept user adding",
                actions: "Accept",
            };
        case ENotificationTypes.ACCEPT_USER_REMOVE:
            return {
                text: "Please accept user adding",
                actions: "Remove",
            };
        case ENotificationTypes.SUBSCRIPTION_EXPIRED:
            return {
                text: "Your subscription is expired",
                actions: "Prolong",
            };
        case ENotificationTypes.SUBSCRIPTION_PROLONGED:
            return {
                text: "Your subscription is prolonged",
                actions: NO_ACTION_STR,
            };
        case ENotificationTypes.YOU_LOST_ACCESS:
            return {
                text: "You are now removed from the device",
                actions: NO_ACTION_STR,
            };

    }

    return {actions: NO_ACTION_STR, text: NO_ACTION_STR}
}
