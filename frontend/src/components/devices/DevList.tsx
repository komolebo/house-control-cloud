import React, {FC, useEffect, useState} from "react";
import {
    devListItemSelect,
    devListItemUnselect
} from "../../styles/DeviceList.css"
import {Box, Button} from "@mui/material";
import {h3Font} from "../../styles/common/fonts.css";

interface IPropDevList {
    devNames: Array<string>;
    onSelect: (i: number) => void
    initSelection?: number;
}

const DevList: FC<IPropDevList> = ({devNames, onSelect, initSelection= 0}) => {
    const [devices, setDevices] = useState<Array<string>>(devNames)
    const [curSel, setCurSel] = useState(initSelection);

    useEffect(() => {
        setDevices(devNames);
        setCurSel(initSelection)
    }, [devNames, initSelection]);

    const handleSelect = (i: number) => {
        console.log("handleSelect", i)
        setCurSel(i);
        onSelect(i);
    }

    return <div style={{maxWidth: '80%'}}>
        {devices.length === 0
                ? <div className={h3Font}>No device is connected yet...</div>
                :
                <Box sx={{ flexGrow: 1, }}>
                    {devices.map((device, i) =>
                        <Button
                            variant={"outlined"}
                            key={i}
                            onClick={ () => handleSelect(i) }
                            id={i === curSel ? devListItemSelect : devListItemUnselect}
                        >
                            {device}
                        </Button>
                    )}
                </Box>
        }
        </div>
};

export default DevList;