import React, {FC, useContext, useState} from "react";
import {h2Font, h4Font, hBold, helpText} from "../../styles/common/fonts.css";
import {Button, Typography} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import {ModalPageState, useGlobalModalContext} from "./ModalProvider";
import logoAttention from "../../assets/modal-attention-round.svg";
import {TDevItem} from "../../globals/DeviceData";
import {shortMuiBtn, widerMuiBtn} from "../../styles/common/buttons.css";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";
import {nestPostClearDeviceUsers} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";


interface IState {
    pageState: ModalPageState,
    resultInfo: IModalDoneDisplayInfo
}

interface IPropClrSetElem {
    devInfo: TDevItem,
    onClear: () => void
}

interface IClrSettingsProp {
    onClose: () => void,
    onClear: (data: any) => void,
    devInfo: TDevItem
}

const ClrSettingElement: FC<IPropClrSetElem> = ({devInfo, onClear}) => {
    return <div>
        <div style={{display: "flex", alignItems: "center"}}>
            <img src={logoAttention} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            <Typography variant="h2"
                        className={hBold}
                        sx={{ml: 2}}
            > Clear device settings </Typography>
        </div>


        <br/><br/>


        <Typography variant="h3"> '{devInfo.name}' on '{devInfo.ip}'</Typography><br/>

        <div className={helpText}>
            Custom device settings will be deleted.
        </div>
        <div className={helpText}>
            All connected users will have lost their access rights.
        </div>
        <div className={helpText}>
            You will need device nearby to get a remote access again.
        </div><br/>

        <div className={cntrContent}>
            <Button variant={"contained"} color={"error"}
                    sx={{
                        mt: 2
                    }}
                    onClick={() => onClear()}
                    className={widerMuiBtn}
            > Clear users </Button>

        </div>
    </div>
}

export const ClearSettingsModal: FC<IClrSettingsProp> = ({devInfo}) => {
    const {modalProps } = useGlobalModalContext();
    const {onClose, data} = modalProps;
    const {userInfo} = useContext(UserGlobalContext);
    const [state, setState] = useState<IState>({
        resultInfo: {} as IModalDoneDisplayInfo,
        pageState: ModalPageState.ReqState
    })

    const handleClear = () => {
        console.log("handleClear")
        userInfo && nestPostClearDeviceUsers(userInfo.id, data.hex).then(resp => {
            console.log("Cleared device: ", resp)
            if (resp.status === 201) {
                setState({
                    pageState: ModalPageState.DoneState,
                    resultInfo: {
                        success: true,
                        header: "Device settings cleared",
                        message: "Please go through initial device registration procedure"
                    }
                })
            }
        }).catch(resp => {
            console.log("Cleared device fail: ", resp.response.data.message)
            setState({
                pageState: ModalPageState.DoneState,
                resultInfo: {
                    success: false,
                    header: resp.response.data.message,
                    message: "Please retry later"
                }
            })
        })
    }

    const handleComplete = () => {
        setState({...state, pageState: ModalPageState.CompleteState});
        onClose();
    }

    return <div>
        {state.pageState === ModalPageState.ReqState
            ? <ClrSettingElement
                devInfo={data}
                onClear={() => handleClear()}
            />
            : <ModalGenericDone
                onDone={() => handleComplete()}
                info={state.resultInfo}
            />
        }
    </div>
}