import React, {FC, useEffect, useState} from "react";
import DevList from "./DevList";
import DevItem, {TDevItem, TDevRole, TDevStatus} from "./DevItem";
import {devContainer, devContContent, devContHead} from "../../styles/DevContainer.css"
import {Button} from "@mui/material";
import {btnCommon} from "../../styles/common/buttons.css";
import logoAddDev from "../../assets/add-device2.svg";
import {h2Font} from "../../styles/common/fonts.css";
import DevItemOwner from "./DevItemOwner";
import {AddDevPopup} from "../popup/AddDevPopup";


export const DevContainer: FC = () => {
    let [devices, setDevices] = useState<Array<TDevItem>>([
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
            hex: "FF00F214",
            ip: "127.0.0.1",
            name: "Netishynka",
            users: [
                {name: "Oleh", id: 0x123213, role: TDevRole.OWNER},
            ],
            status: TDevStatus.Disconnected,
            role: TDevRole.CHILD
        },
        {
            hex: "FF00F215",
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
    let [curDev, setCurDev] = useState(devices.length ? 0 : -1);
    const [isPopAddDev, setPopAddDev] = useState(false);


    const handleDevInfoChange = (devName: string) => {
        devices[curDev].name = devName;
        setDevices([...devices]);
    }

    const clearDevice = (devId: string) => {
        setCurDev( devices.length - 1 ? 0 : -1);

        setDevices([...devices.filter(dev => {return dev.hex !== devId})])
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
                    onClick={() => setPopAddDev(true)}
            >
                Add device
            </Button>
            {isPopAddDev
                ? <AddDevPopup
                    onclose={() => setPopAddDev(false)}
                    onact={() => setPopAddDev(false)}
                />
                : <div/>
            }
        </div>

        { curDev >= 0 &&
        <div>
            <div className={h2Font}>Device information</div>
            <div id={devContContent}>
                <DevItem dev={devices[curDev]} onDevChange={dev_info => {
                    handleDevInfoChange(dev_info)
                }}/>

                { devices[curDev].role === TDevRole.OWNER &&
                    <DevItemOwner devInfo={devices[curDev]} onDevClrSetting={(id) => clearDevice(id)}/>
                 }
            </div>
        </div>
        }
    </div>
}