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
//2022-05-17 23:20:42.693+03