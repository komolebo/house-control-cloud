import {FC} from "react";
import {devList, devListContent, devListHead, devListItem} from "../../styles/DeviceList.css"
import {cntrTxt} from "../../styles/common/fonts.css";
import DevItem, {TDevItem, TDevRole, TDevStatus} from "./DevItem";
import DevItemOwner from "./DevItemOwner";

const DevList: FC = () => {
    const devices: Array<TDevItem>= [
        {
            hex: "FF00F213",
            ip: "192.168.0.1",
            name: "Sofia Borshaga",
            users: [
                {name: "Oleh", id: 0x123213, role: TDevRole.OWNER},
                {name: "Horse", id: 0x121113, role: TDevRole.GUEST},
            ],
            status: TDevStatus.Connected,
            role: TDevRole.OWNER
        },
        {
            hex: "FF00F213",
            ip: "192.168.0.1",
            name: "Netishynka",
            users: [
                {name: "Oleh", id: 0x123213, role: TDevRole.OWNER},
            ],
            status: TDevStatus.Disconnected,
            role: TDevRole.CHILD
        },
    ]

    return <div id={devList}>
        <div id={devListHead} className={cntrTxt}>
            {devices.length ? "YOUR DEVICES:" : "NO DEVICE YET"}
        </div>
        <div id={devListContent}>

            <div id={devListItem}>
                {devices.length ? devices.map(user => {
                        return user.role === TDevRole.OWNER
                            ? <DevItemOwner user={user}/>
                            : <DevItem user={user}/>
                    })
                    : <div/>
                }
            </div>
        </div>
    </div>
}

export default DevList;