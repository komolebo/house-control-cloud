import React, {FC, useEffect, useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
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

    const handleSelect = (event: React.SyntheticEvent, i: number) => {
        console.log("handleSelect", i)
        setCurSel(i);
        onSelect(i);
    }

    return <div style={{maxWidth: '100%'}}>
        {devices.length === 0
                ? <div className={h3Font}>No device is connected yet...</div>
                :
                    <Box>
                        <Tabs
                            sx={{backgroundColor:"grey", p:0}}
                            value={curSel}
                            onChange={handleSelect}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                            allowScrollButtonsMobile
                        >
                            {devices.map((device, i) =>
                                <Tab
                                    label={device}
                                    key={i}
                                />
                            )}
                        </Tabs>
                    </Box>
        }
        </div>
};

export default DevList;