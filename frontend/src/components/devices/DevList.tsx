import React, {FC, useEffect, useState} from "react";
import {Box, Tab, Tabs, Typography} from "@mui/material";
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
            ? <Typography variant="h4">No device is connected yet...</Typography>
            :
                <Box>
                    <Tabs
                        sx={{p:0}}
                        value={curSel}
                        onChange={handleSelect}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        allowScrollButtonsMobile
                        textColor="primary"
                        indicatorColor="primary"
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