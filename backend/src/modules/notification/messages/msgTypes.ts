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

export enum MsgTypes {
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
    ACCEPT_OWNER_RIGHTS = "ACCEPT_OWNER_RIGHTS",

    SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
    SUBSCRIPTION_PROLONGED = "SUBSCRIPTION_PROLONGED",

}

export enum NotificationCmd {
    Accept = "Accept",
    Block = "Block",
    Remove = "Remove",
    Close = "Close"
}

interface IExplainMap {text: string, actions: string[]}

const NO_ACTION_STR = "";

export function NotificationActionMap(type: MsgTypes, dbObj: Notifications): IExplainMap {
    switch (type) {
        case MsgTypes.ACCEPT_USER_ADD:
            return {
                text: "Please accept user adding",
                actions: ["Accept", "Block"],
            };
        case MsgTypes.ACCEPT_USER_REMOVE:
            return {
                text: "Please accept user adding",
                actions: ["Remove", "Block"],
            };
        case MsgTypes.ACCEPT_OWNER_RIGHTS:
            return {
                text: "Please accept user become an owner",
                actions: ["Accept"],
            };
        default:
            return {
                text: "",
                actions: []
            }
        // case Types.SUBSCRIPTION_EXPIRED:
        //     return {
        //         text: "Your subscription is expired",
        //         actions: "Prolong",
        //     };
        // case Types.SUBSCRIPTION_PROLONGED:
        //     return {
        //         text: "Your subscription is prolonged",
        //         actions: NO_ACTION_STR,
        //     };
        // case Types.YOU_LOST_ACCESS:
        //     return {
        //         text: "You are now removed from the device",
        //         actions: NO_ACTION_STR,
        //     };

    }

    return {actions: [NO_ACTION_STR], text: NO_ACTION_STR}
}
