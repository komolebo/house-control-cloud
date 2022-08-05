import React, {FC, useContext, useEffect, useState} from "react";
import {devItemDelim} from "../../styles/DeviceItem.css"
import {h3Font, h4Font} from "../../styles/common/fonts.css";
import {Button, TextField} from "@mui/material";
import logoStart from "../../assets/arrow-start.svg"
import logoEdit from "../../assets/edit-device.svg";
import {TDevItem} from "../../globals/DeviceData";
import {shorterMuiBtn, shortMuiBtn, wideMuiBtn} from "../../styles/common/buttons.css";
import {UserGlobalContext} from "../../globals/UserAuthProvider";
import {nestPatchDeviceAlias} from "../../http/rqData";


export interface IProps {
    dev: TDevItem,
}


const DevItem: FC<IProps> = ({dev}) => {
    const [editMode, setEditMode] = useState(false);
    let [name, setName] = useState(dev.name);
    const {userInfo} = useContext(UserGlobalContext);

    useEffect(() => {
        setEditMode(false);
    }, [dev])

    const handleSave = () => {
        userInfo && nestPatchDeviceAlias(userInfo.id, dev.hex, name)
            .then(() => {
                setEditMode(false);
            })
    }

    return <div >
        <div className={[h3Font].join(' ')}>Name</div>
        {editMode
            ? <div className={[h4Font, devItemDelim].join(' ')}>
                <TextField
                    error={name.length === 0}
                    helperText={name.length === 0 ? "Name cannot be empty" : ""}
                    size={"small"}
                    color={"info"}
                    defaultValue={dev.name}
                    fullWidth={true}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            : <div className={[h4Font, devItemDelim].join(' ')}>{dev.name}</div>
        }

        <div className={[h3Font].join(' ')}>ID</div>
        <div className={[h4Font, devItemDelim].join(' ')}>{dev.hex}</div>

        <div className={[h3Font].join(' ')}>IP</div>
        <div className={[h4Font, devItemDelim].join(' ')}>{dev.ip}</div>

        {dev.version && (
            <div>
                <div className={[h3Font].join(' ')}>Version</div>
                <div className={[h4Font, devItemDelim].join(' ')}>{dev.version}</div>
            </div>
        )}

        {editMode
            ? <Button variant={"contained"}
                      sx={{
                          mt: 2,
                      }}
                      disabled={name.length === 0}
                      onClick={handleSave}
                      className={wideMuiBtn}
            > Save </Button>
            : <Button variant={"contained"}
                      color={"success"}
                      sx={{
                          mt: 2
                      }}
                      endIcon={<img src={logoStart} alt={"Logo start"}/>}
                      className={shortMuiBtn}
                      disabled={!dev.active}
            > START </Button>
        }

        {editMode
            ?
            <Button variant={"text"}
                    onClick={() => setEditMode(!editMode)}
                    sx={{
                        right: 0, top: 10, position:'absolute',
                    }}
                    className={shorterMuiBtn}
            > Cancel
            </Button>
            :
            <Button variant={"text"}
                onClick={() => setEditMode(!editMode)}
                sx={{
                    right: 0, top: 10, position:'absolute',
                }}
                endIcon={<img src={logoEdit} alt={"Logo edit"}/>}
                className={shorterMuiBtn}
            > Edit
            </Button>
        }
    </div>
}

export default DevItem;