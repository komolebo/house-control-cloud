import React, {FC, useState} from "react";
import DevList from "./DevList";
import DevItem, {TDevItem, TDevRole, TDevStatus} from "./DevItem";
import {devContainer, devContContent, devContHead} from "../../styles/DevContainer.css"
import {Button} from "@mui/material";
import {btnCommon} from "../../styles/common/buttons.css";
import logoAddDev from "../../assets/add-device2.svg";
import {h2Font} from "../../styles/common/fonts.css";
import DevItemOwner from "./DevItemOwner";

export const DevContainer: FC = () => {
    const [curDev, setCurDev] = useState(0);
    const [devices, setDevices] = useState<Array<TDevItem>>([
        {
            hex: "FF00F213",
            ip: "192.168.0.1",
            name: "Sofia Borshaga",
            users: [
                {name: "Oleh", id: 0x123213, role: TDevRole.OWNER},
                {name: "Horse", id: 0x121113, role: TDevRole.GUEST},
                {name: "Oleh1", id: 0x123213, role: TDevRole.CHILD},

            ],
            status: TDevStatus.Connected,
            role: TDevRole.OWNER
        },
        {
            hex: "FF00F213",
            ip: "127.0.0.1",
            name: "Netishynka",
            users: [
                {name: "Oleh", id: 0x123213, role: TDevRole.OWNER},
            ],
            status: TDevStatus.Disconnected,
            role: TDevRole.CHILD
        },
        {
            hex: "FF00F213",
            ip: "174.164.1.1",
            name: "Chicago Bulls board",
            users: [
                {name: "Oleh", id: 0x123213, role: TDevRole.OWNER},
                {name: "Horse", id: 0x121113, role: TDevRole.GUEST},
                {name: "Oleh1", id: 0x123213, role: TDevRole.CHILD},
                {name: "Horse", id: 0x121113, role: TDevRole.GUEST},
                {name: "Kid", id: 0x123213, role: TDevRole.CHILD},

            ],
            status: TDevStatus.Connected,
            role: TDevRole.OWNER
        },
    ])

    const handleDevInfoChange = (devName: string) => {
        devices[curDev].name = devName;
        setDevices([...devices]);
    }

    return <div id={devContainer}>
        <div id={devContHead}>
            <DevList
                devNames={devices.map(el => el.name)}
                onSelect={i => setCurDev(i)}
            />
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 200, height: 42, borderRadius: 47, right: 0, top: 0, position:'absolute',
                        textTransform: 'none'
                    }}
                    endIcon={
                        <img src={logoAddDev}/>
                    }
            >
                Add device
            </Button>
        </div>

        <div className={h2Font}>Device information</div>

        <div id={devContContent}>
            <DevItem dev={devices[curDev]} onDevChange={dev_info => { handleDevInfoChange(dev_info)}}/>

            {devices.length && devices[curDev].role === TDevRole.OWNER
            ? <DevItemOwner dev={devices[curDev]} onDevChange={(info) => {}}/>
            : <div/>}
        </div>
    </div>
}