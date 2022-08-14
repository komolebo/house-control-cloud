import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Box, Button, Typography} from "@mui/material";
import {cntrContent} from "../../styles/common/position.css";
import {h2Font, hBold, helpText} from "../../styles/common/fonts.css";
import logoDisconnect from "../../assets/disconnect-device.svg";
import {TDevItem} from "../../globals/DeviceData";
import ModalGenericDone, {IModalDoneDisplayInfo} from "./ModalGenericDone";
import {nestPostUnsubscribeFromDevice} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";

interface IUnsubElemProp {
    onAction: (resInfo: IModalDoneDisplayInfo) => void,
    devInfo: TDevItem
}


const UnsubscribeUsrElement: FC<IUnsubElemProp> = ({onAction, devInfo}) => {
    const {userInfo} = useContext(UserGlobalContext);

    const handleUnsubscribe = () => {
        userInfo && nestPostUnsubscribeFromDevice(userInfo.id, devInfo.hex)
            .then(() => {
                onAction({
                    success: true,
                    header: "Successfully unsubscribed",
                    message: `You has no access to ${devInfo.name} anymore`,
                });
            })
            .catch(resp => {
                onAction({
                    success: false,
                    header: "Access right not removed",
                    message: `Please retry later`,
                });
            })
    }

    return <div>
        <div style={{display: "flex", alignItems: "center"}}>
            <img src={logoDisconnect} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            <Typography variant="h2"
                        className={hBold}
                        sx={{ml: 2}}
            > Unsubscribe
            </Typography>
        </div><br/>

        <Box sx={{pt: 2, pb: 2}}>
            <div className={helpText}>
                Press unsubsribe if you don’t need to connect
            </div>
            <div className={helpText}>
                to ‘{devInfo.name}’ anymore.
            </div>
        </Box>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    sx={{
                        mt: 2
                    }}
                    onClick={() => handleUnsubscribe()}
            >
                Unsubscribe
            </Button>
        </div>

    </div>
}


export const UnsubscribeUsrModal: FC = () => {
    const {modalProps, hideModal} = useGlobalModalContext();
    const {devInfo} = modalProps.data;
    const [result, setResult] = useState<IModalDoneDisplayInfo>({} as IModalDoneDisplayInfo)

    const setModeDone = (res: IModalDoneDisplayInfo) => {
        setResult(res);
    }
    const complete = () => {
        hideModal();
    }

    return (
        <div>
            { !result.header
                ? <UnsubscribeUsrElement
                    onAction={(resInfo) => setModeDone(resInfo)}
                    devInfo={devInfo}
                />
                : <ModalGenericDone
                    onDone={() => complete()}
                    info={result}
                />
            }
        </div>
    )
}