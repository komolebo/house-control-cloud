import React, {FC, useContext, useEffect, useState} from "react";
import {devItemDelim} from "../../styles/DeviceItem.css"
import {Button, TextField, Typography} from "@mui/material";
import {ReactComponent as LogoStart} from "../../assets/arrow-start.svg";
import logoEdit from "../../assets/edit-device.svg";
import {TDevItem} from "../../globals/DeviceData";
import {shorterMuiBtn, shortMuiBtn, wideMuiBtn} from "../../styles/common/buttons.css";
import {UserGlobalContext} from "../../globals/providers/UserAuthProvider";
import {nestPatchDeviceAlias} from "../../http/rqData";
import TunnelContainer from "../tunnel/TunnelContainer";


export interface IProps {
    dev: TDevItem,
}


const DevItem: FC<IProps> = ({dev}) => {
    const [editMode, setEditMode] = useState (false);
    const [showMode, setShowMode] = useState (false);
    const {userInfo} = useContext (UserGlobalContext);
    let [name, setName] = useState ("");

    useEffect (() => {
        setName (dev.name)

        function handleEscapeKey(event: KeyboardEvent) {
            if (event.code === 'Escape') {
                setEditMode (false)
            }
        }

        document.addEventListener ('keyup', handleEscapeKey)
        return () => document.removeEventListener ('keyup', handleEscapeKey)
    }, [])

    useEffect (() => {
        setEditMode (false);
    }, [dev])

    const handleSave = () => {
        userInfo && nestPatchDeviceAlias (userInfo.id, dev.hex, name)
            .then (() => {
                setEditMode (false);
            })
    }

    const formattedID = dev.hex.replace (/^(.{2})(.{2})(.{2})(.{2}).*/, '$1:$2:$3:$4');

    return <div>
        <Typography variant="h4">Name </Typography>
        {editMode
            ? <div className={[devItemDelim].join (' ')}>
                <TextField
                    error={name.length === 0}
                    helperText={name.length === 0 ? "Name cannot be empty" : ""}
                    size={"small"}
                    color={"info"}
                    defaultValue={dev.name}
                    fullWidth={true}
                    autoFocus
                    onChange={e => setName (e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSave ()}
                />
                <Typography variant="h6" sx={{ml: 1, mt: 1}}>Please note: current notifications or history items will
                    keep old device name</Typography>
            </div>
            : <Typography className={devItemDelim} variant="h3">{dev.name} </Typography>
            // <div className={[h4Font, devItemDelim].join(' ')}>{dev.name}</div>
        }

        <Typography variant="h4">ID </Typography>
        <Typography className={devItemDelim} variant="h3">{formattedID}</Typography>

        <Typography variant="h4">IP </Typography>
        <Typography className={devItemDelim} variant="h3">{dev.ip} </Typography>

        {dev.version && (
            <div>
                <Typography variant="h4">Version </Typography>
                <Typography className={devItemDelim} variant="h3">{dev.version} </Typography>
            </div>
        )}

        {editMode
            ? <Button variant={"contained"}
                      sx={{
                          mt: 2,
                      }}
                      color="info"
                      disabled={name.length === 0}
                      onClick={handleSave}
                      className={wideMuiBtn}
            > Save </Button>
            : !showMode && <Button variant={"contained"}
                      color={"success"}
                      sx={{
                          mt: 2
                      }}
                      endIcon={
                          // <img src={logoStart} alt={"Logo start"}/>
                          <LogoStart fill={dev.active ? "white" : "grey"}/>
                      }
                      onClick={() => setShowMode (true)}
                      className={shortMuiBtn}
                      disabled={!dev.active}
            > START </Button>
        }

        {editMode
            ?
            <Button variant="text"
                    onClick={() => setEditMode (!editMode)}
                    sx={{
                        right: 0, top: 10, position: 'absolute',
                    }}
                    className={shorterMuiBtn}
                    color="info"
            > Cancel
            </Button>
            :
            <Button variant="text"
                    onClick={() => setEditMode (!editMode)}
                    sx={{
                        right: 0, top: 10, position: 'absolute',
                    }}
                    endIcon={<img src={logoEdit} alt={"Logo edit"}/>}
                    className={shorterMuiBtn}
                    color="info"
            > Edit
            </Button>
        }
        {!editMode && showMode &&
        <TunnelContainer name={name} id={formattedID} hw={"1.4.1"} sw={dev.version} latest={true} connected={true}
                         onclose={() => setShowMode (false)}/>
        }
    </div>
}

export default DevItem;