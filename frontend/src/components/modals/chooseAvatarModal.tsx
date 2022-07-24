import React, {FC, useContext, useState} from "react";
import {useGlobalModalContext} from "./ModalProvider";
import {Avatar, Box, Button, IconButton, Toolbar} from "@mui/material";
import {childFlexCont6, cntrContent, flexCont6} from "../../styles/common/position.css";
import logoDone from "../../assets/done-big.svg";
import {h2Font, h5Font, helpText} from "../../styles/common/fonts.css";
import logoBack from "../../assets/arrow-back.svg";
import {wideMuiBtn, widerMuiBtn} from "../../styles/common/buttons.css";
import {postUpdateUserPref} from "../../http/rqData";
import logoAvaSelect from "../../assets/ava-select.svg";
import logoAvaAdd from "../../assets/ava-add.svg";
import AvatarEditor from 'react-avatar-editor'

interface AvatarChooseState {
    selected: number,
    enableSave: boolean;
}
const initialstate: AvatarChooseState = {
    selected: -1,
    enableSave: false
}

const DEFAULT_AVATARS_COUNT = 15;
const avatarIndexes = Array.from(Array(DEFAULT_AVATARS_COUNT).keys())
const getDefaultAvatarPath = (num: number) => {
    return `/avatars/avatar${num}.svg`
}


const DoneElement: FC = () => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            <img src={logoDone} alt={"Logo done"}/>
        </div><br/>

        <div className={[h2Font, cntrContent].join(' ')}>
            Access requested
        </div><br/>

        <div className={[helpText, cntrContent].join(' ')}>
            Please check device screen of wait
        </div>
        <div className={[helpText, cntrContent].join(' ')}>
            for owner’s approval
        </div><br/><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    // onClick={() => onAction("Finaly requested rights")}
                    startIcon={<img src={logoBack} alt={"Logo get back"}/>}
                    className={widerMuiBtn}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}
export const ChooseAvatarModal: FC = ({}) => {
    const [values, setValues] = useState<AvatarChooseState>(initialstate)
    const { modalProps,hideModal} = useGlobalModalContext();

    const {data, onAct} = modalProps;
    const curAvatarSrc = data.curAvatarSrc;

    const handleSelect = (ind: number, isCurrent: boolean) => {
        setValues({...values,
            selected: ind,
            enableSave: ind !== -1 && !isCurrent
        })
    }
    const handleSave = () => {
        const newAvatarSrc: string = getDefaultAvatarPath(values.selected)
        postUpdateUserPref({
            profile_photo: newAvatarSrc
        }).then(resp => {
            onAct(newAvatarSrc);
            hideModal();
        })
    }
    const handleFileUpload = (event: any) => {
        // console.log(event.target.files[0].name);
    };

    return (
        <div style={{display: "flex", flexDirection: "column" , maxWidth: "620px"}}>
            <div className={h2Font}>

                {/*<img src={logoAddDev} id="logo-add-dev" alt={"logo-add-dev"}/>*/}
                Choose new profile photo
            </div><br/>

            <div className={flexCont6}>
                {avatarIndexes.map((avaInd) => {
                    const path = getDefaultAvatarPath(avaInd);
                    const isCurrentAvatar = path === curAvatarSrc;
                    return <div key={avaInd} style={{position: "relative"}}>
                        <Avatar
                            alt="Remy Sharp"
                            src={path}
                            sx={
                                isCurrentAvatar
                                ?   {
                                        width: 100, height: 100,
                                        p: "5px 0 0 0",
                                        border: "1px solid blue",
                                    }
                                :   {
                                        width: 100, height: 100,
                                        p: "5px 0 0 0",
                                    }
                            }
                            onClick={() => handleSelect(avaInd, isCurrentAvatar)}
                        />
                        {
                            values.selected === avaInd && !isCurrentAvatar
                            ? <img src={logoAvaSelect} style={{position: "absolute", right: 10, top: 10}}/>
                            : <></>
                        }
                    </div>
                })}

                <label>
                    <input
                        accept=".png"
                        style={{ display: "none" }}
                        type="file"
                        onChange={e => {
                            console.log(e.target.files && e.target.files[0]);
                        }}
                    />
                    <img src={logoAvaAdd} alt={"Add avatar"} style={{margin: 10}}/>
                </label>

                <AvatarEditor
                    image="http://example.com/initialimage.jpg"
                    width={250}
                    height={250}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                />

            </div><br/>

            <Button variant={"contained"}
                    onClick={handleSave}
                    className={wideMuiBtn}
                    disabled={!values.enableSave}
            > Update avatar </Button>
        </div>
        // <AddDevPopup onclose={() => handleModalToggle()} onact={() => handleModalToggle()}/>
    )
}