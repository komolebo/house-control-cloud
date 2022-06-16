import {FC} from "react";
import {
    devItemBottom,
    devItemUserRights,
    devItemGenericBlock,
    devItem,
    devItemBottomLeft, devItemBottomRight, devName, devProp, devStat
} from "../../styles/DeviceItem.css"
import {btn} from "../../styles/common/buttons.css";
import {bold, cntrTxt, headFont} from "../../styles/common/fonts.css";
import {wide} from "../../styles/common/position.css"

export interface IProps {
    user: TDevItem
}

export enum TDevStatus {
    Connected,
    Interrupted,
    Disconnected
}

export enum TDevRole {
    OWNER,
    CHILD,
    GUEST
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


const DevItem: FC<IProps> = ({user}: IProps) => {
    return <div id={devItem}>
        {/*<div id={devItemGenericBlock}>*/}
            <div id={devItemUserRights} className={headFont}>{TDevRole[user.role]}</div>

            <div id={devItemBottom}>
                <div id={devItemBottomLeft}>
                    <div className={devProp} id={devStat}>{TDevStatus[user.status]}</div>
                    <div className={devProp}>
                        <button className={btn} disabled={user.status != TDevStatus.Connected}
                                onClick={()=>{console.log("click")}}>
                            Run
                        </button>
                    </div>
                </div>

                <div id={devItemBottomRight}>
                    <div className={[devProp, bold].join(' ')} id={devName}>{user.name}</div>
                    <div className={[devProp].join(' ')} id={devStat}>id: '{user.hex}'</div>
                    <div className={devProp} id={devStat}>{user.ip}</div>
                </div>
            </div>
        {/*</div>*/}

    </div>
}

export default DevItem;