import {FC, useState} from "react";
import {Box, Popper} from "@mui/material";
import logoClose from "../../assets/close.svg"
import {imgHover} from "../../styles/common/buttons.css";

interface IPopupProp {
    children: any,
    onclose: () => void
}

export const Popup: FC<IPopupProp> = ({children, onclose}) => {
    return (
        <Popper
            id={"simple-popper"}
            open={true} //Boolean(anchorEl)
            // anchorEl={anchorEl}
            sx={{
                backgroundColor: "rgba(0,0,0,0.7)",
                width: "100%", height: "100%",
            }}
        >
            {/* popup window style */}
            <Box
                sx={{ p: 3, position: "absolute", ml: "50%", top: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#FFFFFF", boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.15)",
                    borderRadius: "15px",
                    display: "flex", flexDirection: "column"
                }}
            >
                <div>
                    <img
                        src={logoClose} className={imgHover}
                        onClick={() => onclose()}
                        style={{float: "right"}}
                    />
                </div>
                {children}
            </Box>
        </Popper>
    );
}