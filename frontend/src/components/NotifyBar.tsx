import React, {FC, useContext, useEffect, useState} from "react";
import {Box, Button, Card, Typography} from "@mui/material";
import {h4FontBlue} from "../styles/common/fonts.css";
import {ReactComponent as LogoBell} from "../assets/bell.svg";
import logoClose from "../assets/close.svg"
import {imgHover, shortMuiBtn} from "../styles/common/buttons.css";
import {styleHeights} from "../styles/common/customMuiStyle";
import {INotifyItemProps, TNotifyItem, TNotifySeverity} from "../globals/NotificationData";
import {deleteNotification, getNotificationsListPerUser, nestPostRoutine} from "../http/rqData";
import {UserGlobalContext} from "../globals/providers/UserAuthProvider";
import {IO_NOTIFICATION_KEY, socket} from "../http/wssocket";
import moment from "moment";

interface INotificationProp {
    onNotificationStatusChange: () => void
}

const colorBySeverity = (severity: TNotifySeverity): string => {
    switch (severity) {
        case TNotifySeverity.Action:
            return "#1690E9";
        case TNotifySeverity.Error:
            return "#C0392B";
        case TNotifySeverity.Info:
            return "#2ED573";
        default:
            return colorBySeverity(TNotifySeverity.Info);
    }
}

const buttonStyleByAction = (action: string) => {
    switch (action.toLowerCase()) {
        case "accept":
            return "info";
        case "block":
            return "error";
        default: return "success"
    }
}

const NotifyElement: FC<INotifyItemProps> = ({item, onAct, onDelete}) => {
    const {userInfo} = useContext(UserGlobalContext)

    console.log(item)
    const handleClick = (notifId: number, cmd: string) => {
        userInfo && nestPostRoutine(userInfo.id, notifId, cmd).then(resp => {
            if (resp.status === 201) {
                onAct();
            }
        })
    }

    return <Box
            sx={{
                borderBottom: "0.5px solid rgba(120, 120, 120, 0.3)",
                display: "flex",
                flexDirection: "row", pt: 2, pb: 2, mr: 2,
                borderRadius: "0 7px 7px 0",
                borderLeft: "5px solid"
            }}
            style={{borderLeftColor: colorBySeverity(item.severity)}}
        >
            <div style={{paddingLeft: 15}}>
                <LogoBell fill={ colorBySeverity(item.severity) }/>
            </div>

            <Box sx={{flexGrow: 6, pl: 2, pr: 2}}>
                <Typography variant="h3">{item.text}</Typography>
                <Typography variant="h6" sx={{pt: "10px"}}>{moment(item.createdAt).fromNow()}</Typography>

                <br/>
                {item.actions && item.actions.length
                    ? item.actions.map((action, i) =>
                        <Button variant={"contained"}
                                sx={{...styleHeights.midHiBtn,
                                    // width: "50%",
                                    mr: 1
                                }}
                                onClick={() => handleClick(item.id, action)}
                                color={buttonStyleByAction(action)}
                                className={shortMuiBtn}
                                key={i}
                        >
                            {action}
                        </Button>
                    ) : <></>
                }
            </Box>

            <div>
                <img src={logoClose} style={{verticalAlign: "top", marginRight: 4}}
                     onClick={ () => onDelete(item.id) }
                     className={imgHover}
                 alt={"Logo close"}/>
            </div>
        </Box>
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

    return <Card
        sx={{
            pt: 2, pb: 2, opacity: 1,
            width: "410px", borderRadius: "12px",
        }}
        className="blur"
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
    </Card>
}