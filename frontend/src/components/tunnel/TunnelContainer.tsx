import React, {FC} from "react";
import {Card, Modal} from "@mui/material";
import TunnelControl from "./TunnelControl";

export interface IProps {
    name: string,
    id: string,
    hw: string,
    sw: string,
    latest: boolean,
    connected: boolean,
    onclose: () => void
}

export const TunnelContainer: FC<IProps> = ({
                                                name,
                                                id,
                                                hw,
                                                sw,
                                                latest,
                                                connected,
                                                onclose
                                            }) => {
    return <div>
        <Modal
            open={true}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card
                sx={{
                    p: 0, m: 0, position: "absolute", left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
                className="blur"
            >
                {/*<TunnelMirror/>*/}
                <TunnelControl name={name} id={id} hw={hw} sw={sw} latest={latest} connected={connected}
                               onclose={onclose}/>
            </Card>
        </Modal>
    </div>
}

export default TunnelContainer;