export interface INotifyItemProps {
    item: TNotifyItem,
    onDelete: (id: number) => void,
    onAct: () => void
}

export enum TNotifySeverity {
    Info="INFO",

    Action="ACTION",
    Error="ERROR"
}

export interface TNotifyItem {
    id: number;
    createdAt: string;
    severity: TNotifySeverity,
    text: string;
    actions: Array<string>
}