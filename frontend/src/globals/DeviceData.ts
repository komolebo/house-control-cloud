export enum TDevRole {
    OWNER,
    CHILD,
    GUEST,
    ROLES_NUMBER
}

export enum TDevStatus {
    Connected,
    Interrupted,
    Disconnected
}

export interface TConnectedUser {
    id: number;
    fullName: string;
    login: string;
    role: TDevRole;
}

export interface TDevItem {
    id: number;
    name: string;
    ip: string;
    hex: string;
    status: TDevStatus,
    role: TDevRole,
    active: boolean;
    unsubscribable: boolean;
    version: string;
}

export const ROLES = Array.from(Array(TDevRole.ROLES_NUMBER).keys());
export const DEFAULT_ROLE = TDevRole.GUEST;
