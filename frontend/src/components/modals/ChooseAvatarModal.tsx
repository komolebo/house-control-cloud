import React, {FC, useContext, useRef, useState} from "react";
import {ModalProps, useGlobalModalContext} from "./ModalProvider";
import {Avatar, Avatar as Ava, Box, Button, Typography} from "@mui/material";
import {cntrContent, cntrVContent, flexCont6} from "../../styles/common/position.css";
import {ReactComponent as LogoDone} from "../../assets/done-big.svg";
import {h2Font, hBold} from "../../styles/common/fonts.css";
import logoBack from "../../assets/arrow-back.svg";
import {wideMuiBtn, widerMuiBtn} from "../../styles/common/buttons.css";
import {DataURIToBlob, nestPatchUserPref, nestPostRemoveAvatar, nestPostUploadAvatar} from "../../http/rqData";
import logoAvaSelect from "../../assets/ava-select.svg";
import logoAvaAdd from "../../assets/ava-add.svg";
import AvatarEdit from 'react-avatar-edit'
import {LoadingButton} from '@mui/lab';
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import logoAvaDelete from "../../assets/ava-delete.svg";

enum EPageState {
    CHOOSE_DEFAULT,
    CROP_CUSTOM,
    UPLOADED_AND_CONFIRMED
}

interface IPropChooseDefElem {
    modalProps: ModalProps,
    switchModalState: (outData: any) => void,
    setCropImage: (data: any) => void
}
interface IPropCropElem {
    modalProps: ModalProps,
    switchModalState: (outData: any) => void,
    formData: any
}
interface IPropDoneElem {
    modalProps: ModalProps,
}
interface IStateChooseDefElem {
    selected: number,
    enableSave: boolean;
    loadingRemoval: boolean;
}
interface IStateCropElem {
    loading: boolean,
    preview: any | null,
}
const initialStateChooseDef: IStateChooseDefElem = {
    selected: -1,
    enableSave: false,
    loadingRemoval: false
}
const initialStateCropElem: IStateCropElem = {
    loading: false,
    preview: null,
}

const DEFAULT_AVATARS_COUNT = 15;
const avatarIndexes = Array.from(Array(DEFAULT_AVATARS_COUNT).keys())
const getDefaultAvatarPath = (num: number) => {
    return `/avatars/avatar${num}.svg`
}


const ChooseDefaultElement: FC<IPropChooseDefElem> = ({
                                                          modalProps,
                                                          switchModalState,
                                                          setCropImage
                                                      }) => {
    const [values, setValues] = useState<IStateChooseDefElem>(initialStateChooseDef)
    const {data, onAct, onClose} = modalProps;
    const curAvatarSrc = data.curAvatarSrc;
    const {userInfo, avatarSrc, setAvatarSrc} = useContext(UserGlobalContext);

    const handleSelect = (ind: number, isCurrent: boolean) => {
        setValues({...values,
            selected: ind,
            enableSave: ind !== -1 && !isCurrent
        })
    }
    const handleUpload = (event: any) => {
        const input_file = event.target.files[0];
        if (input_file) {
            setCropImage(input_file)
            switchModalState(EPageState.CROP_CUSTOM)
        }
    };
    const handleRemoveAvatar = () => {
        setValues({...values, loadingRemoval: true})
        userInfo && nestPostRemoveAvatar(userInfo.id).then(res => {
            console.log(res);
            setAvatarSrc("");
            // onChange();
            setValues({...values, loadingRemoval: false})
        })
    }
    const handleSave = () => {
        const newAvatarSrc: string = getDefaultAvatarPath(values.selected)
        userInfo && nestPatchUserPref(userInfo.id, {
            profile_photo: newAvatarSrc
        }).then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                onAct(newAvatarSrc);
                onClose();
            }
        })
    }

    return <div>
        <Typography variant="h2"
                    className={hBold}
                    sx={{ml: 2}}
        > Choose new profile photo </Typography><br/>

        <div className={flexCont6}>
            {avatarIndexes.map ((avaInd) => {
                const path = getDefaultAvatarPath (avaInd);
                const isCurrentAvatar = path === curAvatarSrc;
                return <div key={avaInd} style={{position: "relative"}}>
                    <Ava
                        alt="Remy Sharp"
                        src={path}
                        className={isCurrentAvatar ? "disable" : ""}
                        onClick={() => handleSelect (avaInd, isCurrentAvatar)}
                    />
                    {
                        values.selected === avaInd && !isCurrentAvatar
                            ? <img src={logoAvaSelect} style={{position: "absolute", right: 10, top: 10}} alt={"select"}/>
                            : <></>
                    }
                </div>
            })}
        </div>

        <div className={flexCont6}>
            { avatarSrc
                ? <div style={{textAlign: "center", position: "relative"}}>
                    <Avatar
                        sx={{
                            m: "10px 0 15px 0",
                            // border: "2px solid #1690E9"
                        }}
                        src={avatarSrc}
                    />
                    <img
                        src={logoAvaDelete}
                        style={{position: "absolute", right: 10, top: 10}}
                        alt={"edit"}
                        onClick={handleRemoveAvatar}
                    />
                </div> : <></>
            }

            <label>
                <input
                    // accept=".png"
                    style={{display: "none"}}
                    type="file"
                    onChange={handleUpload}
                />
                <img src={logoAvaAdd} alt={"Add avatar"} style={{margin: 10}}/>
            </label>
        </div><br/>

        <div className={cntrContent}>
            <LoadingButton
                variant={"contained"}
                onClick={handleSave}
                className={wideMuiBtn}
                disabled={!values.enableSave}
                loading={values.loadingRemoval}
                loadingPosition="end"
                endIcon={<></>}
            > Update photo </LoadingButton>
        </div>
    </div>
}
const CropUploadedElement: FC<IPropCropElem> = ({
                                                    modalProps,
                                                    switchModalState,
                                                    formData
                                                }) => {
    const [values, setValues] = useState<IStateCropElem>(initialStateCropElem)
    const {onAct} = modalProps;
    const image = useRef(URL.createObjectURL(formData.get("file")))
    const {userInfo} = useContext(UserGlobalContext);

    const handleUpdateAvatar = () => {
        const newForm = new FormData()
        newForm.append("file", DataURIToBlob(values.preview))
        userInfo && nestPostUploadAvatar(userInfo.id, newForm).then(resp => {
            if (resp.status === 201 && resp.data.public_id) {
                // URL.revokeObjectURL(image)
                console.log("revokeObjectURL")
                console.log(resp)
                onAct(resp.data.url)
                setValues({...values, loading: false})
                switchModalState(EPageState.UPLOADED_AND_CONFIRMED)
            }
        })
        setValues({...values, loading: true})
    }
    const onClose = () => {
        // URL.revokeObjectURL(image)
        console.log("revokeObjectURL")
        setValues({...values, preview: null })
        switchModalState(EPageState.CHOOSE_DEFAULT);
    }
    const onCrop = (preview: any) => {
        setValues({...values, preview: preview})
    }
    const onBeforeFileLoad = (elem: any) => {
        // if(elem.target.files[0].size > 71680){
        //     alert("File is too big!");
        //     elem.target.value = "";
        // };
    }

    return <div>
        <div className={h2Font}>
            Crop uploaded file
        </div><br/>

        <div>
            <div style={{display: "flex", flexDirection: "row", height: 180, gap: 20}}>
                <div style={{flexGrow: 2,  width: 250, height: 250}}>
                    <AvatarEdit
                        width={250}
                        height={150}
                        onCrop={onCrop}
                        onClose={onClose}
                        onBeforeFileLoad={onBeforeFileLoad}
                        src={image.current}
                    />
                </div>
                <div className={cntrVContent} style={{flexGrow: 2, width: 150, height: 150}}>
                    <img src={values.preview} alt="Preview"  />
                </div>
            </div>
        </div>

        <div className={cntrContent}>
            <LoadingButton
                endIcon={<></>}
                loading={values.loading}
                variant={"contained"}
                onClick={handleUpdateAvatar}
                className={wideMuiBtn}
                loadingPosition="end"
            > {values.loading ? "Loading" : "Confirm avatar"}
            </LoadingButton>
        </div>
    </div>
}


const DoneElement: FC<IPropDoneElem> = ({modalProps}) => {
    return <Box sx={{m: "10px 20px 10px 20px"}}>
        <div className={cntrContent}>
            {/*<img src={logoDone} alt={"Logo job is done"}/>*/}
            <LogoDone fill="#2ED573"/>
        </div><br/>

        <div className={[cntrContent].join(' ')}>
            <Typography variant="h2">Avatar uploaded</Typography>
        </div><br/>

        <div className={cntrContent}>
            <Button variant={"contained"}
                    onClick={() => modalProps.onClose()}
                    startIcon={<img src={logoBack} alt={"Logo get back"}/>}
                    className={widerMuiBtn}
            >
                Back to Home
            </Button>
        </div>
    </Box>
}


export const ChooseAvatarModal: FC = () => {
    const [state, setState] = useState<EPageState>(EPageState.CHOOSE_DEFAULT)
    const { modalProps } = useGlobalModalContext();
    const formData = useRef(new FormData())

    const setCropImage = (file: any) => {
        formData.current.append("file", file)
        console.log("setCropImage")
    }

    const switchToState = (s: EPageState) => {
        if (state !== s) setState(s);
        console.log("switchToState", state, s)
    }

    return (
        <div style={{display: "flex", flexDirection: "column" , maxWidth: "630px"}}>
            { state === EPageState.CHOOSE_DEFAULT
                ? <ChooseDefaultElement modalProps={modalProps}
                                        switchModalState={(s: EPageState) => switchToState(s)}
                                        setCropImage={setCropImage}
                />
                : state === EPageState.CROP_CUSTOM
                    ? <CropUploadedElement modalProps={modalProps}
                                           switchModalState={(s: EPageState) => switchToState(s)}
                                           formData={formData.current}
                    />
                    : <DoneElement modalProps={modalProps}/>
            }
        </div>
    )
}