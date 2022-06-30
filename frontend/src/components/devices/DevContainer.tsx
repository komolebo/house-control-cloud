import React, {FC, useState} from "react";
import DevList from "./DevList";
import DevItem, {TConnectedUser, TDevItem, TDevRole, TDevStatus} from "./DevItem";
import {devContainer, devContContent, devContHead} from "../../styles/DevContainer.css"
import {Button} from "@mui/material";
import {btnCommon} from "../../styles/common/buttons.css";
import logoAddDev from "../../assets/add-device2.svg";
import logoDisconnect from "../../assets/disconnect-device.svg";
import {h2Font} from "../../styles/common/fonts.css";
import DevItemOwner from "./DevItemOwner";
import {MODAL_TYPE, useGlobalModalContext} from "../modals/ModalProvider";


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
    const { showModal, hideModal } = useGlobalModalContext();


    const handleDevInfoChange = (devName: string) => {
        devices[curDev].name = devName;
        setDevices([...devices]);
    }

    const clearDevice = (devId: string) => {
        setCurDev( devices.length - 1 ? 0 : -1);

        setDevices([...devices.filter(dev => {return dev.hex !== devId})])
        console.log("ClearDevice: ", devId);
    }
    const inviteUsr = (devId: string, userInfo: TConnectedUser) => {
        devices.map(dev => {
            if (dev.hex === devId) {
                console.log("Pushing info", userInfo)
                dev.users.push(userInfo)
            }
            return dev;
        })
        setDevices([...devices]);
    }

    return <div id={devContainer}>
        <div id={devContHead}>
            <div style={{flexGrow: 10}}>
                <DevList
                    devNames={devices.map(el => el.name)}
                    onSelect={i => setCurDev(i)}
                    initSelection={curDev}
                />
            </div>
            <div style={{flexGrow: 1}}>
            <Button variant={"contained"}
                    className={btnCommon}
                    sx={{
                        width: 160, height: 42, borderRadius: 47,
                        textTransform: 'none',
                        float: "right", ml: 2
                    }}
                    endIcon={
                        <img src={logoAddDev}/>
                    }
                    onClick={() => showModal(MODAL_TYPE.AddDevModal, {
                        onClose: () => {console.log("Modal onClose")},
                        onAct: () => {hideModal()}
                    })}
            >
                Add device
            </Button>
            <Button variant={"outlined"}
                    className={btnCommon}
                    sx={{
                        width: 160, height: 42, borderRadius: 47,
                        textTransform: 'none',
                        float: "right",
                    }}
                    endIcon={
                        <img src={logoDisconnect}/>
                    }
                    onClick={() => showModal(MODAL_TYPE.UnsubscribeUsrModal, {
                        onClose: () => {console.log("Modal onClose")},
                        onAct: (devInfo) => { clearDevice(devInfo.hex) },
                        data: {
                            devInfo: devices[curDev]
                        }
                    })}
            >
                Unsubscribe
            </Button>
            </div>
        </div>

        { curDev >= 0 &&
        <div>
            <div className={h2Font}>Device information</div>
            <div id={devContContent}>
                <DevItem dev={devices[curDev]} onDevChange={dev_info => {
                    handleDevInfoChange(dev_info)
                }}/>

                { devices[curDev].role === TDevRole.OWNER &&
                    <DevItemOwner
                        devInfo={devices[curDev]}
                        onDevClrSetting={id => clearDevice(id)}
                        onUsrInvite={(devId, userInfo) => inviteUsr(devId, userInfo)}/>
                 }
            </div>
        </div>
        }
    </div>
}