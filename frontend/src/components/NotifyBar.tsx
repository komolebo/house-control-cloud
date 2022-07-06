import React, {FC, useState} from "react";
import {Box, Button} from "@mui/material";
import {h4Font, h4FontBlue, helpText} from "../styles/common/fonts.css";
import logoBellBlue from "../assets/bell-blue.svg"
import logoBellGreen from "../assets/bell-green.svg"
import logoBellRed from "../assets/bell-red.svg"
import logoClose from "../assets/close.svg"
import {imgHover} from "../styles/common/buttons.css";
import {colBorderBlue, colBorderGreen, colBorderRed} from "../styles/common/colors.css"
import {styleHeights} from "../styles/common/customMuiStyle";

interface INotifyItemProps {
    item: TNotifyItem,
    onDelete: (id: number) => void,
    onAct: () => void
}

enum TNotifyPrio {
    Info,
    Critical,
    Approve
}

interface TNotifyItem {
    id: number;
    text: string;
    date: string;
    prio: TNotifyPrio
}

const notifications: Array<TNotifyItem> = [
    {
        id: 0,
        text: "Lorem ipsum dolor sit amet, avec \n" +
            "moi consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Approve},
    {
        id: 1,
        text: "Lorem ipsum dolor sit amet, \n" +
            "consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Info},
    {
        id: 2,
        text: "Lorem ipsum dolor sit amet, \n" +
            "consectetur adipiscing elit",
        date: "Yesterday, 10:00 AM",
        prio: TNotifyPrio.Info},
    {
        id: 3,
        text: "Lorem ipsum dolor sit amet, \n" +
            "consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Critical},
    {
        id: 4,
        text: "Lorem ipsum dolor sit amet, avec \n" +
            "moi consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Approve},
    {
        id: 5,
        text: "Lorem ipsum dolor sit amet, \n" +
            "consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Critical},
    {
        id: 6,
        text: "Lorem ipsum dolor sit amet, \n" +
            "consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Info},
    {
        id: 7,
        text: "Lorem ipsum dolor sit amet, \n" +
            "consectetur adipiscing elit",
        date: "Today, 10:00 AM",
        prio: TNotifyPrio.Approve},
]

const NotifyElement: FC<INotifyItemProps> = ({item, onAct, onDelete}) => {

    return <div>
        <Box sx={{borderBottom: "0.5px solid rgba(47, 53, 66, 0.5)",
                    display: "flex",
                    flexDirection: "row", pt: 2, pb: 2, mr: 2,
            }}>
            <div style={{paddingLeft: 15}}
                 className={item.prio === TNotifyPrio.Approve
                     ? colBorderBlue
                    : item.prio === TNotifyPrio.Info
                         ? colBorderGreen
                         : colBorderRed
                 }>
                {item.prio === TNotifyPrio.Approve
                    ? <img src={logoBellBlue} alt={"Logo bel blue"}/>
                    : item.prio === TNotifyPrio.Info
                        ? <img src={logoBellGreen} alt={"Logo bel green"}/>
                        : <img src={logoBellRed} alt={"Logo bel red"}/>
                }

            </div>

            <Box sx={{flexGrow: 6, pl: 2, pr: 2}}>
                <div className={[h4Font].join(' ')}>
                    {item.text}
                </div>
                <div className={[helpText].join(' ')} style={{paddingTop: "10px", paddingBottom: "10px"}}>
                    {item.date}
                </div>

                <Button variant={"contained"}
                        sx={{...styleHeights.midHiBtn,
                            width: "50%"
                        }}
                        onClick={onAct}
                >
                    Approve
                </Button>

            </Box>

            <div>
                <img src={logoClose} style={{verticalAlign: "top", marginRight: 4}}
                     onClick={ () => onDelete(item.id) }
                     className={imgHover}
                 alt={"Logo close"}/>
            </div>
        </Box>
    </div>
}


export const NotifyBar: React.FC = () => {
    const [messages, setMessages] = useState(notifications);

    const handleRemoveElement = (id: number) => {
        setMessages([...messages.filter(obj => {return obj.id !== id})])
    }


    return <div>
        {/* Notifications window */}
        <Box sx={{ pt: 2, pb: 2, bgcolor: "#FFFFFF",
            width: "410px", borderRadius: "12px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
            }}
        >
            {/* Notifications header */}
            <Box  sx={{ p: 1, pl: 3, pr: 3, display: "flex", flexDirection: "row",
                        borderBottom: "0.5px solid rgba(47, 53, 66, 0.5)"}}>
                <div className={h4FontBlue} style={{flexGrow: 3,}}>Notifications</div>
                <div className={h4FontBlue}>{messages.length}</div>
            </Box>

            {/* Notifications list */}
            <Box
                sx={{mb: 2,
                    flexDirection: "column",
                    maxHeight: "600px",
                    overflowY: "auto",}}
            >
                {/*<div style={{maxHeight: "200px"}}>*/}
                {
                    messages.map(el => {
                        return <NotifyElement  item={el} onDelete={handleRemoveElement} onAct={() => console.log("onAct")} />
                    })
                }
                {/*</div>*/}
            </Box>
        </Box>
    </div>;
}