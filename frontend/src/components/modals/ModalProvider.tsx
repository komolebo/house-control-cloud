import React, {createContext, FC, useContext, useEffect, useState} from "react";

import {Box, Card, Modal} from "@mui/material";
import logoClose from "../../assets/close.svg";
import {imgHover} from "../../styles/common/buttons.css";
import {AddDevModal} from "./AddDevModal";
import {ClearSettingsModal} from "./ClearSettingsModal";
import {InviteUserModal} from "./InviteUserModal";
import {ModifyAccessModal} from "./ModifyAccessModal";
import {UnsubscribeUsrModal} from "./UnsubsribeUsrModal";
import {DeleteAccountModal} from "./DeleteAccountModal";
import {ChooseAvatarModal} from "./ChooseAvatarModal";
import {floatr} from "../../styles/common/position.css";

export enum MODAL_TYPE {
    AddDevModal,
    ClrSettModal,
    ModifyUsrAccessModal,
    InviteUsrModal,
    UnsubscribeUsrModal,
    ChooseAvatarModal,
    DeleteAccountModal,
    DefaultModal
}

export enum ModalPageState{
    ReqState,
    DoneState,
    CompleteState
}

export type ModalProps = {
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

// add here new modal dialogues
const MODAL_COMPONENTS: any = {
    [MODAL_TYPE.AddDevModal]: AddDevModal,
    [MODAL_TYPE.ClrSettModal]: ClearSettingsModal,
    [MODAL_TYPE.InviteUsrModal]: InviteUserModal,
    [MODAL_TYPE.ModifyUsrAccessModal]: ModifyAccessModal,
    [MODAL_TYPE.UnsubscribeUsrModal]: UnsubscribeUsrModal,
    [MODAL_TYPE.ChooseAvatarModal]: ChooseAvatarModal,
    [MODAL_TYPE.DeleteAccountModal]: DeleteAccountModal,
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
    showModal: () => {},
    modalProps: DEFAULT_MODAL_PROPS
})
export const useGlobalModalContext = () => useContext(GlobalModalContext);


export const ModalProvider: FC<IPropGlobalModal> = ({children}) => {
    const [modaltype, setType] = useState(MODAL_TYPE.DefaultModal);
    const [modalProps, setModalProps] = useState<ModalProps>({
        onAct: () => {},
        onClose: () => {},
        data: {}
    });

    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.code === 'Escape') {
                hideModal()
            }
        }

        document.addEventListener('keyup', handleEscapeKey)
        return () => document.removeEventListener('keyup', handleEscapeKey)
    }, [])

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
            <Modal
                open={true}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card
                    sx={{
                        p: 3, position: "absolute", left: "50%", top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                    className="blur"
                >
                    <div className={floatr} style={{width: 20, height: 20}}>
                        <img alt={"Logo close"}
                             src={logoClose} className={imgHover}
                             onClick={() => hideModal()}
                         />
                    </div>
                    {renderComponent()}
                </Card>
            </Modal>
            }
            {children}
        </GlobalModalContext.Provider>
    )
}
