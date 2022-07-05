import React, {FC, useEffect, useState} from "react";
import DevList from "./DevList";
import DevItem from "./DevItem";
import {devContainer, devContContent, devContHead} from "../../styles/DevContainer.css"
import {Button} from "@mui/material";
import logoAddDev from "../../assets/add-device2.svg";
import logoDisconnect from "../../assets/disconnect-device.svg";
import {h2Font} from "../../styles/common/fonts.css";
import DevItemOwner from "./DevItemOwner";
import {MODAL_TYPE, useGlobalModalContext} from "../modals/ModalProvider";
import {TConnectedUser, TDevItem, TDevRole} from "../../globals/DeviceData";
import {wideMuiBtn} from "../../styles/common/buttons.css";
import {floatr} from "../../styles/common/position.css";
import {fetchDevListByUser} from "../../http/rqData";
import {getUserInfo} from "../../globals/UserAuthProvider";

interface IState {
    ind: number;
    devices: Array<TDevItem>;
}

export const DevContainer: FC = () => {
    const [values, setValues] = useState<IState>({
        ind: -1,
        devices: []
    })
    const { showModal, hideModal } = useGlobalModalContext();
    const userInfo = getUserInfo();

    const handleDevInfoChange = (devName: string) => {
        values.devices[values.ind].name = devName;
        setValues({...values, devices: values.devices})
    }

    const clearDevice = (devId: string) => {
        setValues({
            devices: values.devices.filter(dev => {return dev.hex !== devId}),
            ind: values.devices.length - 1 ? 0 : -1
        })
        console.log("ClearDevice: ", devId);
    }
    const inviteUsr = (devId: string, userInfo: TConnectedUser) => {
        values.devices.map(dev => {
            if (dev.hex === devId) {
                console.log("Pushing info", userInfo)
                // dev.users.push(userInfo)
            }
            return dev;
        })
        setValues({...values, devices: values.devices});
    }


    useEffect(() => {
        userInfo && fetchDevListByUser(userInfo.id, (data: Array<TDevItem>) => {
            if (JSON.stringify(values.devices) !== JSON.stringify(data)) {
                setValues({
                    devices: data,
                    ind: data.length ? 0 : -1
                })
            }
        })
    }, [values])

    return <div id={devContainer}>
        <div id={devContHead}>
            <div style={{flexGrow: 10}}>
                <DevList
                    devNames={values.devices.map(el => el.name)}
                    onSelect={i => setValues({...values, ind: i})}
                    initSelection={values.ind}
                />
            </div>
            <div style={{flexGrow: 1}}>
            <Button variant={"contained"}
                    sx={{ ml: 2 }}
                    endIcon={
                        <img src={logoAddDev} alt={"Adde device logo"}/>
                    }
                    onClick={() => showModal(MODAL_TYPE.AddDevModal, {
                        onClose: () => {console.log("Modal onClose")},
                        onAct: () => {hideModal()}
                    })}
                    className={[wideMuiBtn, floatr].join(' ')}
            >
                Add device
            </Button>
            <Button variant={"outlined"}
                    endIcon={
                        <img src={logoDisconnect} alt={"Logo disconnect"}/>
                    }
                    onClick={() => showModal(MODAL_TYPE.UnsubscribeUsrModal, {
                        onClose: () => {console.log("Modal onClose")},
                        onAct: (devInfo) => { clearDevice(devInfo.hex) },
                        data: {
                            devInfo: values.devices[values.ind]
                        }
                    })}
                    className={[wideMuiBtn, floatr].join(' ')}
            >
                Unsubscribe
            </Button>
            </div>
        </div>
        { values.ind >= 0 &&
        <div>
            <div className={h2Font}>Device information</div>

            <div id={devContContent}>
                <DevItem dev={values.devices[values.ind]} onDevChange={dev_info => {
                    handleDevInfoChange(dev_info)
                }}/>

                { values.devices[values.ind].role === TDevRole.OWNER &&
                    <DevItemOwner
                        devInfo={values.devices[values.ind]}
                        onDevClrSetting={id => clearDevice(id)}
                        onUsrInvite={(devId, userInfo) => inviteUsr(devId, userInfo)}/>
                 }
            </div>
        </div>
        }
    </div>
}