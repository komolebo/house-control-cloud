import React, {FC, useEffect, useState} from "react";
import {
    devListItemSelect,
    devListItemUnselect
} from "../../styles/DeviceList.css"
import {Box, Button} from "@mui/material";

interface IPropDevList {
    devNames: Array<string>;
    onSelect: (i: number) => void
}

const DevList: FC<IPropDevList> = ({devNames, onSelect}) => {
    const [devices, setDevices] = useState<Array<string>>(devNames)
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        setDevices(devNames);
    }, [devNames]);

    const handleSelect = (i: number) => {
        setSelected(i);
        onSelect(i);
    }

    return <div style={{maxWidth: '80%'}}>
        {devices.length === 0
                ? <div>No Devices</div>
                :
                <Box sx={{ flexGrow: 1, }}>
                    {devices.map((device, i) =>
                        <Button
                            variant={"outlined"}
                            key={i}
                            onClick={ () => handleSelect(i) }
                            id={i === selected ? devListItemSelect : devListItemUnselect}
                        >
                            {device}
                        </Button>
                    )}
                </Box>
        }
        </div>
};

export default DevList;