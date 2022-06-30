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
    name: string;
    id: number;
    role: TDevRole;
}

export interface TDevItem {
    name: string;
    ip: string;
    hex: string;
    users: Array<TConnectedUser>;
    status: TDevStatus,
    role: TDevRole
}

export const ROLES = Array.from(Array(TDevRole.ROLES_NUMBER).keys());
export const DEFAULT_ROLE = TDevRole.GUEST;
