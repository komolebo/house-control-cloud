import React, {FC, useContext, useEffect, useState} from "react";
import DevList from "./DevList";
import DevItem from "./DevItem";
import {devContainer, devContHead} from "../../styles/DevContainer.css"
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
import {nestGetDevListByUser, roleStrToId} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/UserAuthProvider";
import {IO_DEV_DATA_CHANGE_KEY, socket} from "../../http/wssocket";
import {casket, leftCasket, rightCasket} from "../../styles/common/pages.css";

interface IState {
    ind: number;
    devices: Array<TDevItem>;
}

export const DevContainer: FC = () => {
    const { showModal, hideModal } = useGlobalModalContext();
    const {userInfo} = useContext(UserGlobalContext);
    const [syncRemoteData, setSyncRemoteData] = useState(false);
    const [values, setValues] = useState<IState>({
        ind: -1,
        devices: [],
    })

    const syncData = () => {
        console.log("Before: ", values)
        userInfo && nestGetDevListByUser(userInfo.id).then(resp => {
            let devList: Array<TDevItem> = [];

            resp.data.forEach((dev: any) => {
                devList.push({
                    name: dev.Roles.alias ? dev.Roles.alias : dev.name,
                    hex: dev.hex,
                    ip: dev.ip,
                    role: roleStrToId(dev.Roles.role),
                    active: dev.active,
                    id: dev.id,
                    status: 0,
                    unsubscribable: dev.canUnsubscribe,
                    version: dev.version,
                })
            })

            // handle newInd change to avoid extra window switching
            const newInd = values.ind < devList.length
                ? values.ind < 0 ? 0 : values.ind
                : devList.length ? 0 : -1
            console.log("Syncing data change: ", values.ind, newInd, devList)
            values.ind = newInd;
            setValues({
                ...values,
                devices: devList,
            })
        })
    }

    useEffect(() => {
        socket.on(IO_DEV_DATA_CHANGE_KEY, () => setSyncRemoteData(true));
        syncData();
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off(IO_DEV_DATA_CHANGE_KEY);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        syncData()
    }, [userInfo])
    useEffect(() => {
        if(syncRemoteData) {
            syncData()
            setSyncRemoteData(false);
        }
    }, [syncRemoteData])

    const handleDevSelect = (newInd: number) => {
        setValues({...values, ind: newInd})
    }

    const canUnsubscribe = values.ind >= 0 && values.devices.length && values.devices[values.ind].unsubscribable;

    return <div id={devContainer}>
        <div id={devContHead}>
            <div style={{flexGrow: 10}}>
                <DevList
                    devNames={values.devices.map(el => el.name)}
                    onSelect={i => handleDevSelect(i)}
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
                        onAct: () => {}
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
                        onAct: () => {},
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
        { values.ind >= 0 && values.devices.length &&
        <div>
            <div className={h2Font}>Device information</div><br/>

            <div className={leftCasket}>
                <div className={casket}>
                    <DevItem
                        dev={values.devices[values.ind]}
                    />
                </div>
            </div>

            { values.devices[values.ind].role === TDevRole.OWNER &&
            <div className={rightCasket}>
                <div className={casket}>
                    <DevItemOwner
                        devInfo={values.devices[values.ind]}
                        onDevDataChanged={() => {}}
                    />
                </div>
            </div>
             }
        </div>
        }
    </div>
}