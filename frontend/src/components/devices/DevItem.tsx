import React, {FC, useState} from "react";
import {
    devItem,
    devItemDelim
} from "../../styles/DeviceItem.css"
import {h3Font, h4Font} from "../../styles/common/fonts.css";
import {Button, TextField} from "@mui/material";
import logoStart from "../../assets/arrow-start.svg"
import logoEdit from "../../assets/edit-device.svg";


export interface IProps {
    dev: TDevItem,
    onDevChange: (dev_info: string) => void
}

export enum TDevStatus {
    Connected,
    Interrupted,
    Disconnected
}

export enum TDevRole {
    OWNER,
    CHILD,
    GUEST,
    ROLES_NUMBER
}

export interface TConnectedUser {
    name: string;
    id: number;
    role: TDevRole;
}

export interface TDevItem {
    name: string;
    ip: string;
    hex: string;
    users: Array<TConnectedUser>;
    status: TDevStatus,
    role: TDevRole
}


const DevItem: FC<IProps> = ({dev, onDevChange}: IProps) => {
    let [editMode, setEditMode] = useState(false);
    let [name, setName] = useState(dev.name);

    const handleSave = () => {
        onDevChange(name);
        setEditMode(false);
    }

    return <div id={devItem}>
        <div className={[h3Font].join(' ')}>Name</div>
        {editMode
            ? <div className={[h4Font, devItemDelim].join(' ')}>
                <TextField
                    error={name.length === 0}
                    label={name.length === 0 ? "Name cannot be empty" : ""}
                    id="outlined-uncontrolled"
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

        {editMode
            ? <Button variant={"contained"}
                      sx={{
                          width: 200, height: 42, borderRadius: 47, marginTop: 2,
                          textTransform: 'none'
                      }}
                      disabled={name.length === 0}
                      onClick={handleSave}
            > Save </Button>
            : <Button variant={"contained"}
                      sx={{
                          backgroundColor: "#2ED573", width: 130, height: 42,
                          textTransform: 'none', borderRadius: 47, marginTop: 2

                      }} endIcon={<img src={logoStart}/>}
            > START </Button>
        }

        {editMode
            ?
            <Button variant={"text"}
                    onClick={() => setEditMode(!editMode)}
                    sx={{
                        width: 100, height: 42, borderRadius: 47, right: 0, top: 10, position:'absolute',
                        textTransform: 'none'
                    }}
            > Cancel
            </Button>
            :
            <Button variant={"text"}
                onClick={() => setEditMode(!editMode)}
                sx={{
                    width: 100, height: 42, borderRadius: 47, right: 0, top: 10, position:'absolute',
                    textTransform: 'none'
                }}
                endIcon={<img src={logoEdit}/>        }
                > Edit
            </Button>
        }
                {/*<div id={devItemBottom}>*/}
                {/*    <div id={devItemBottomLeft}>*/}
                {/*        <div className={devProp}>*/}


                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div id={devItemBottomRight}>*/}
                {/*        <div className={[devProp, bold].join(' ')} id={devName}>{user.name}</div>*/}
                {/*        <div className={[devProp].join(' ')} id={devStat}>id: '{user.hex}'</div>*/}
                {/*        <div className={devProp} id={devStat}>{user.ip}</div>*/}
                {/*    </div>*/}
                {/*</div>*/}
    </div>
}

export default DevItem;