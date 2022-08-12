import React, {FC, useContext, useState} from "react";
import {h2Font, h4Font, helpText} from "../../styles/common/fonts.css";
import {Button, Typography} from "@mui/material";
import {cntrContent, cntrVContent, flexG1, flexr} from "../../styles/common/position.css";
import {useGlobalModalContext} from "./ModalProvider";
import logoAttention from "../../assets/attention.svg";
import logoDeleteAcc from "../../assets/delete-account-big.svg";
import {TDevItem} from "../../globals/DeviceData";
import {wideMuiBtn} from "../../styles/common/buttons.css";
import {colRedText} from "../../styles/common/colors.css";
import {LoadingButton} from "@mui/lab";
import {deleteSelfAccount} from "../../http/rqData";
import {UserGlobalContext} from "../../globals/UserAuthProvider";


interface IProp {
    onClose: () => void,
    onClear: (data: any) => void,
    devInfo: TDevItem
}

export const DeleteAccountModal: FC<IProp> = () => {
    const {modalProps } = useGlobalModalContext();
    const {onClose} = modalProps;
    const {userInfo, clearUserData} = useContext(UserGlobalContext);

    const [loading, setLoading] = useState(false)

    const handleClear = () => {
        setLoading(true)
        userInfo && deleteSelfAccount(userInfo.id).then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                clearUserData()
                onClose()
            }
        })
    }

    return <div>
        <div className={flexr}>
            <div style={{width: "40px"}}>
                <img src={logoDeleteAcc} id="logo-clr-sett" alt={"logo-clr-sett"}/>
            </div>
            <div style={{width: "100%"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Typography variant="h2">Delete account</Typography>
                </div>
                <br/>

                <div className={helpText}>
                    Please acknowledge the account deletion consequences
                </div>
                <br/><br/>


                <div className={[h4Font, cntrVContent, colRedText].join (' ')} style={{marginBottom: 10}}>
                    <img src={logoAttention} id="logo-clr-sett" alt={"logo-clr-sett"} style={{marginRight: 10}}/>
                    You will be removed from connected devices
                </div>
                <div className={[h4Font, cntrVContent, colRedText].join (' ')}>
                    <img src={logoAttention} id="logo-clr-sett" alt={"logo-clr-sett"} style={{marginRight: 10}}/>
                    Devices you own alone will be cleared out of users
                </div>
                <br/>
            </div>
        </div>
        <div className={flexr}>
            <div className={[cntrContent, flexG1].join (' ')}>
                <LoadingButton
                    variant={"outlined"}
                    endIcon={<></>}
                    color={"error"}
                    sx={{
                        mt: 2
                    }}
                    onClick={() => handleClear()}
                    className={wideMuiBtn}
                    loadingPosition="end"
                    loading={loading}
                > Delete account </LoadingButton>
            </div>

            <div className={[cntrContent, flexG1].join (' ')}>
                <Button variant={"contained"}
                        sx={{
                            mt: 2
                        }}
                        onClick={() => onClose()}
                        className={wideMuiBtn}
                        disabled={loading}
                > Cancel </Button>
            </div>
        </div>
    </div>
}
