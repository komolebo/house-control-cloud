import React, {FC, useContext, useEffect, useState} from "react";
import {Box, Button, Card, Typography} from "@mui/material";
import {h4Font, h4FontBlue, h5Font} from "../styles/common/fonts.css";
import logoBellBlue from "../assets/bell-blue.svg"
import logoBellGreen from "../assets/bell-green.svg"
import logoBellRed from "../assets/bell-red.svg"
import logoClose from "../assets/close.svg"
import {imgHover} from "../styles/common/buttons.css";
import {colBorderBlue, colBorderGreen, colBorderRed} from "../styles/common/colors.css"
import {styleHeights} from "../styles/common/customMuiStyle";
import {INotifyItemProps, TNotifyItem, TNotifySeverity} from "../globals/NotificationData";
import {deleteNotification, getNotificationsListPerUser} from "../http/rqData";
import {UserGlobalContext} from "../globals/UserAuthProvider";
import {IO_NOTIFICATION_KEY, socket} from "../http/wssocket";
import moment from "moment";

interface INotificationProp {
    onNotificationStatusChange: () => void
}


const NotifyElement: FC<INotifyItemProps> = ({item, onAct, onDelete}) => {
    console.log(item)

    return <div>
        <Box sx={{borderBottom: "0.5px solid rgba(47, 53, 66, 0.5)",
                    display: "flex",
                    flexDirection: "row", pt: 2, pb: 2, mr: 2,
            }}>
            <div style={{paddingLeft: 15}}
                 className={item.severity === TNotifySeverity.Action
                     ? colBorderBlue
                    : item.severity === TNotifySeverity.Info
                         ? colBorderGreen
                         : colBorderRed
                 }>
                {item.severity === TNotifySeverity.Action
                    ? <img src={logoBellBlue} alt={"Logo bel blue"}/>
                    : item.severity === TNotifySeverity.Info
                        ? <img src={logoBellGreen} alt={"Logo bel green"}/>
                        : <img src={logoBellRed} alt={"Logo bel red"}/>
                }

            </div>

            <Box sx={{flexGrow: 6, pl: 2, pr: 2}}>
                <Typography variant="h3">{item.text}</Typography>
                <Typography variant="h5" sx={{pt: "10px"}}>{moment(item.createdAt).fromNow()}</Typography>

                {item.actions
                    ? <Button variant={"contained"}
                            sx={{...styleHeights.midHiBtn,
                                width: "50%"
                            }}
                            onClick={onAct}
                    >
                        {item.actions}
                    </Button>
                    : <></>
                }

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


export const NotifyBar: FC<INotificationProp> = ({onNotificationStatusChange}) => {
    const [notifications, setNotifications] = useState<Array<TNotifyItem>>([])
    const {userInfo} = useContext(UserGlobalContext)

    const handleRemoveElement = (id: number) => {
        userInfo && deleteNotification(userInfo.id, id).then(resp => {
            if (resp.status === 200 || resp.status === 201) {
                console.log("Response from removing the notification", resp)
                syncNotifications();
            }
        })
    }

    const syncNotifications = () => {
        userInfo && getNotificationsListPerUser(userInfo?.id)
            .then(resp => {
                if (resp.status === 201 || 200) {
                    let notificationList: Array<TNotifyItem> = resp.data;
                    notificationList = notificationList.sort(
                        (a, b) => {
                            const d1 = new Date(a.createdAt);
                            const d2 = new Date(b.createdAt);
                            return d2.getTime() - d1.getTime()
                        })
                    setNotifications(notificationList);
                    onNotificationStatusChange();
                } else {}
            })
    }
    const onNotification = (data: any) => {
        console.log("NotifyBar onNotification")
        syncNotifications();
    }

    useEffect(() => {
        socket.on(IO_NOTIFICATION_KEY, onNotification);

        syncNotifications();

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.off(IO_NOTIFICATION_KEY, onNotification);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return  (
    <Card sx={{
        pt: 2, pb: 2, opacity: 1,
        width: "410px", borderRadius: "12px",

    }}
    >
        {/* Notifications header */}
        <Box sx={{
            p: 1, pl: 3, pr: 3, display: "flex", flexDirection: "row",
            borderBottom: "0.5px solid rgba(47, 53, 66, 0.5)",
        }}>
            <div className={h4FontBlue} style={{flexGrow: 3,}}>Notifications</div>
            <div className={h4FontBlue}>{notifications.length}</div>
        </Box>

        {/* Notifications list */}
        <Box
            sx={{
                mb: 2,
                flexDirection: "column",
                maxHeight: "600px",
                overflowY: "auto",
            }}
        >
            {notifications.map ((el, i) => {
                return <div key={i}>
                    <NotifyElement item={el} onDelete={handleRemoveElement} onAct={() => console.log ("onAct")}/>
                </div>
            })}
        </Box>
    </Card>)
}