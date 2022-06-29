import React, {createContext, FC, useContext, useState} from "react";

import {Box, Popper} from "@mui/material";
import logoClose from "../../assets/close.svg";
import {imgHover} from "../../styles/common/buttons.css";
import {AddDevModal} from "./AddDevModal";
import {ClearSettingsModal} from "./ClearSettingsModal";

export enum MODAL_TYPE {
    AddDevModal,
    ClrSettModal,
    RmUsrAccessModal,
    InviteUsrModal,
    DefaultModal
}

type ModalProps = {
    onClose: () => void,
    onAct: (data: any) => void
    data?: any,
}

type ContextType = {
    showModal: (
        modelType: MODAL_TYPE,
        modalProps: ModalProps
    ) => void,
    hideModal: () => void,
    modalProps: ModalProps
}

const MODAL_COMPONENTS: any = {
    [MODAL_TYPE.AddDevModal]: AddDevModal,
    [MODAL_TYPE.ClrSettModal]: ClearSettingsModal,
    [MODAL_TYPE.DefaultModal]: null,
}

interface IPropGlobalModal {
    children: any
}

const DEFAULT_MODAL_PROPS: ModalProps = {
    onClose: () => {},
    onAct: (data: any) => {},
    data: {}
}

const GlobalModalContext = createContext<ContextType>({
    hideModal: () => {},
    showModal: (modelType: MODAL_TYPE,
                modalProps: ModalProps) => {},
    modalProps: DEFAULT_MODAL_PROPS
})
export const useGlobalModalContext = () => useContext(GlobalModalContext);


export const ModalProvider: FC<IPropGlobalModal> = ({children}) => {
    // debugger;
    const [modaltype, setType] = useState(MODAL_TYPE.DefaultModal);
    const [modalProps, setModalProps] = useState<ModalProps>({
        onAct: () => {},
        onClose: () => {},
        data: {}
    });

    const showModal = (modalType: MODAL_TYPE, modalProps: ModalProps) => {
        setType(modalType);
        setModalProps(modalProps);
    }

    const hideModal = () => {
        setType(MODAL_TYPE.DefaultModal);
        setModalProps(DEFAULT_MODAL_PROPS);
    }

    const renderComponent = () => {
        const ModalComponent = MODAL_COMPONENTS[modaltype];
        if (modaltype === MODAL_TYPE.DefaultModal || !ModalComponent) {
            return null;
        }
        return <ModalComponent id="global-modal" {...modalProps}/>
    }

    return (
        <GlobalModalContext.Provider value={{showModal, hideModal, modalProps}}>
            {modaltype !== MODAL_TYPE.DefaultModal &&
            <Popper
                id={"simple-popper"}
                open={true}
                sx={{
                    backgroundColor: "rgba(0,0,0,0.7)",
                    width: "100%", height: "100%",
                }}
            >
                {/* popup window style */}
                <Box
                    sx={{
                        p: 3, position: "absolute", ml: "50%", top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#FFFFFF", boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.15)",
                        borderRadius: "15px",
                        display: "flex", flexDirection: "column"
                    }}
                >
                    <div>
                        <img
                            src={logoClose} className={imgHover}
                            onClick={() => hideModal()}
                            style={{float: "right"}}
                        />
                    </div>
                    {renderComponent()}
                </Box>
            </Popper>
            }
            {children}
        </GlobalModalContext.Provider>
    )
}

export default GlobalModalContext;