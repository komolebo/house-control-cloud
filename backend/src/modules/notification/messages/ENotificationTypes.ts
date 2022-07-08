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
    YOU_ARE_REMOVED,

    // with options //
    ACCEPT_USER_ADD,
    ACCEPT_USER_REMOVE,

    SUBSCRIPTION_EXPIRED,
    SUBSCRIPTION_PROLONGED,

}

interface IExplainMap {text: string, actions: string}

const typeStr = (type: ENotificationTypes): string => {
    return ENotificationTypes[type];
}
export function ExplainNotificationMap(type: ENotificationTypes): IExplainMap {
    switch (type.toString()) {
        case typeStr(ENotificationTypes.DEVICE_ADDED):
            return {
                text: "Device is successfully added",
                actions: "OK"
            };
        case typeStr(ENotificationTypes.YOU_ARE_ADDED):
            return {
                text: "You are now added to the device",
                actions: "Sure",
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
                actions: "",
            };
        case typeStr(ENotificationTypes.YOU_ARE_REMOVED):
            return {
                text: "You are now removed from the device",
                actions: "",
            };

    }

    return {actions: "", text: ""}
    // [ENotificationTypes[ENotificationTypes.DEVICE_ADDED]]: {
    //     text: "The device is successfully added",
    //     actions: ["OK"]
    // }
}
//2022-05-17 23:20:42.693+03