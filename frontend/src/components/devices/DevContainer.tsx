import React, {FC, useEffect, useState} from "react";
import DevList from "./DevList";
import DevItem from "./DevItem";
import {devContainer, devContContent, devContHead} from "../../styles/DevContainer.css"
import {Button} from "@mui/material";
import logoAddDev from "../../assets/add-device2.svg";
import logoDisconnect from "../../assets/disconnect-device.svg";
import logoDisconnectGrey from "../../assets/disconnect-device-grey.svg";
import {h2Font} from "../../styles/common/fonts.css";
import DevItemOwner from "./DevItemOwner";
import {MODAL_TYPE, useGlobalModalContext} from "../modals/ModalProvider";
import {TDevItem, TDevRole} from "../../globals/DeviceData";
import {wideMuiBtn} from "../../styles/common/buttons.css";
import {floatr} from "../../styles/common/position.css";
import {fetchDevListByUser, postUnsubscribeFromDevice} from "../../http/rqData";
import {getUserInfo} from "../../globals/UserAuthProvider";
import {IO_DEV_DATA_CHANGE_KEY, socket} from "../../http/wssocket";

interface IState {
    ind: number;
    devices: Array<TDevItem>;
}

export const DevContainer: FC = () => {
    const [dataSync, setDataSync] = useState(false);
    const [values, setValues] = useState<IState>({
        ind: -1,
        devices: [],
    })
    const { showModal, hideModal } = useGlobalModalContext();
    const canUnsubscribe = values.ind >= 0 && values.devices[values.ind].unsubscribable;
    const userInfo = getUserInfo();

    const handleDevInfoChange = (devName: string) => {
        values.devices[values.ind].name = devName;
        setValues({...values, devices: values.devices})
    }

    const unsubscribeDevice = (devId: string) => {
        postUnsubscribeFromDevice(devId).then(resp => {
            // console.log("Unsubscribed: ")
            setValues({...values, ind: values.ind - 1})
        })
    }
    const onAddDevice = () => {
        // syncData();
    }

    const onRemoteDeviceChanged = () => {
        setDataSync(true);
    }

    const syncData = () => {
        userInfo && fetchDevListByUser(userInfo.id, (devList: Array<TDevItem>) => {
            if (JSON.stringify(values.devices) !== JSON.stringify(devList)) {
                console.log("Syncing data change: ", devList)

                // handle newInd change to avoid extra window switching
                const newInd = values.ind < devList.length
                    ? values.ind < 0
                        ? 0
                        : values.ind
                    : devList.length
                        ? 0
                        : -1
                setValues({
                    devices: devList,
                    ind: newInd,
                })
            }
        })
    }

    useEffect(() => {
        socket.on(IO_DEV_DATA_CHANGE_KEY, onRemoteDeviceChanged);
        syncData();
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off(IO_DEV_DATA_CHANGE_KEY, onRemoteDeviceChanged);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (dataSync) {
            syncData();
            setDataSync(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSync])

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
                        onClose: () => hideModal(),
                        onAct: () => syncData()
                    })}
                    className={[wideMuiBtn, floatr].join(' ')}
            >
                Add device
            </Button>
            <Button variant={"outlined"}
                    endIcon={
                        <img
                            src={canUnsubscribe ? logoDisconnect : logoDisconnectGrey} alt={"Logo disconnect"}
                        />
                    }
                    onClick={() => showModal(MODAL_TYPE.UnsubscribeUsrModal, {
                        onClose: () => {console.log("Modal onClose")},
                        onAct: (devInfo) => { unsubscribeDevice(devInfo.hex) },
                        data: {
                            devInfo: values.devices[values.ind]
                        }
                    })}
                    className={[wideMuiBtn, floatr].join(' ')}
                    disabled={!canUnsubscribe}
            >
                Unsubscribe
            </Button>
            </div>
        </div>
        { values.ind >= 0 &&
        <div>
            <div className={h2Font}>Device information</div>

            <div id={devContContent}>
                <DevItem dev={values.devices[values.ind]} onDevDataChange={dev_info => {
                    handleDevInfoChange(dev_info)
                }}/>

                { values.devices[values.ind].role === TDevRole.OWNER &&
                    <DevItemOwner
                        devInfo={values.devices[values.ind]}
                        onDevDataChanged={() => onAddDevice()}/>
                 }
            </div>
        </div>
        }
    </div>
}