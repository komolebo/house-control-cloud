import React, {ChangeEvent, FC, useState} from "react";
import {fontLgrey, h5Font, helpText, hFont} from "../styles/common/fonts.css";
import {historyItem, historyPage, historyTable, historyTableHead, historyTableRow} from "../styles/HistoryPage.css"
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    IconButton,
    InputBase,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import logoBackToHome from "../assets/arrow-left-back-home.svg";
import logoHistoryNotification from "../assets/history-item-notification.svg";
import logoHistoryAccount from "../assets/history-item-account.svg";
import logoHistoryDevice from "../assets/history-item-device.svg";
import {HOME_PAGE} from "../utils/consts";
import {useNavigate} from "react-router-dom";
import {
    applyTextFilter,
    applyTypeFilter,
    getIndexesFromArray,
    HISTORY_MSG_TYPES,
    historyData,
    THistoryMsgType
} from "../globals/HistoryData";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {shorterMuiBtn} from "../styles/common/buttons.css";
import {cntrContent, cntrVContent, flexG20, floatl, floatr} from "../styles/common/position.css";
import moment from "moment";
import logoSettings from "../assets/settings.svg";

interface IHistoryState {
    msgType: THistoryMsgType;
    from: Date | null,
    to: Date | null,
    keyword: string,
    selection: Array<number>;
    anchorElSetting: HTMLElement | null;
    filteredData: Array<number>
}

const initialState = {
    // filters
    msgType: THistoryMsgType.None,
    from: null,
    to: null,
    keyword: "",

    selection: [],
    anchorElSetting: null,
    filteredData: getIndexesFromArray(historyData)
};

const settingsMenu = [
    {
        name: 'Delete item',
        handler: () => {},
        show: true,
    },
    {
        name: 'Filter by this device',
        handler: () => {},
        show: false,
    },
    {
        name: 'Filter by this user',
        handler: () => {},
        show: false,
    }
];

export const HistoryPage: FC = () => {
    let [values, setValues] = useState<IHistoryState>(initialState);

    const navigate = useNavigate();

    const filterRawData = (): Array<number> => {
        let filteredData = getIndexesFromArray(historyData);

        if (values.msgType !== THistoryMsgType.None) {
            filteredData = applyTypeFilter(filteredData, historyData, values.msgType)
        }
        if (values.keyword !== "") {
            filteredData = applyTextFilter(filteredData, historyData, values.keyword)
        }
        return filteredData;
    }

    const handleMsgTypeChange = (event: SelectChangeEvent) => {
        const msgType = Number(event.target.value);
        if(msgType !== values.msgType) {
            values.msgType = msgType; // on purpose not in setValues
            setValues({ ...values, filteredData: filterRawData()})
        }
    };
    const handleChangeDateFrom = (newValue: Date | null) => {
        setValues({...values, from: newValue});
    };
    const handleChangeDateTo = (newValue: Date | null) => {
        setValues({...values, to: newValue});
    };
    const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({...values, keyword: e.target.value})
    }
    const handleConfirmKeyword = (e: React.MouseEvent<HTMLElement>) => {
        setValues({...values, filteredData: filterRawData()})
    }
    const handleClearFilters = () => {
        setValues(initialState);
    }
    const handleCheck = (e: ChangeEvent<HTMLInputElement>, ind: number) => {
    }
    const handleSettings = (event: React.MouseEvent<HTMLElement>, ind: number) => {
        settingsMenu[1].show = historyData[ind].devId !== undefined;
        settingsMenu[2].show = historyData[ind].uId !== undefined;
        setValues({...values, anchorElSetting: event.currentTarget})
    }
    const handleCloseSettings = (event: React.MouseEvent<HTMLElement>) => {
        setValues({...values, anchorElSetting: null})
    }

    console.log("Draw", values)
    return <div id={historyPage}>
        <div className={hFont}>History</div>
        <div className={helpText}>Here you can view device actions history or your activitivity</div><br/>

        <IconButton color="inherit" onClick={() => navigate(HOME_PAGE)}>
            <img src={logoBackToHome} alt={"Back to home"} />
            <div className={h5Font}>
                &nbsp;Home
            </div>
        </IconButton><br/><br/><br/>

        <div id={historyTableHead}>
            <FormControl sx={{ width: 150}} >
                <InputLabel id="demo-simple-select-label2">Filter</InputLabel>
                <Select
                    labelId="label-simple-select-msgtype"
                    id="simple-select-msgtype"
                    value={values.msgType !== THistoryMsgType.None ? values.msgType.toString () : ""}
                    label="Filter"
                    onChange={handleMsgTypeChange}
                >
                    {
                        HISTORY_MSG_TYPES.map ((msgType, i) => {
                            return <MenuItem key={i} value={msgType}>{THistoryMsgType[msgType]}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>

            <Paper
                component="form"
                sx={{ p: '2px 4px', ml: 3, mr: 3, display: 'flex',
                    alignItems: 'center',
                    flexGrow: 10,
                    borderRadius: "6px",
                    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.04)",
                    border: "solid 1px rgba(0, 0, 0, 0.25)",
                }}
                color={"info"}
            >
                <IconButton onClick={handleConfirmKeyword}
                            // type="submit"
                            sx={{ pl: '10px' }}>
                    <SearchIcon/>
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by keyword"
                    value={values.keyword}
                    color={"info"}
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={handleChangeKeyword}
                />
                <IconButton type="submit" sx={{ p: '10px' }}>
                    <ClearIcon/>
                </IconButton>
            </Paper>

            <Box sx={{maxWidth: 150, flexDirection: "row"}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    label="From"
                    inputFormat="MM/dd/yyyy"
                    value={values.from}
                    onChange={handleChangeDateFrom}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            </Box>

            <Box sx={{mr: 3, ml: 3, maxWidth: 150}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    label="From"
                    inputFormat="MM/dd/yyyy"
                    value={values.to}
                    onChange={handleChangeDateTo}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            </Box>


            <div className={[cntrVContent, floatr].join(' ')}>
                <Button variant={"text"}
                        sx={{ flexGrow: 1}}
                        className={shorterMuiBtn}
                        onClick={() => handleClearFilters()}
                > Clear filters
                </Button>
            </div>
        </div>

        <div id={historyTable}>
            <table style={{width: "100%", lineHeight: 0, border: 0}}>
                <tbody>
                {
                    values.filteredData.map((hInd, i) => {
                        return <tr id={historyTableRow} key={i}>
                            <td className={[historyItem].join(' ')}
                                style={{width: 30}}>
                                <Checkbox onChange={e => handleCheck(e, i)} />
                            </td>

                            <td className={[h5Font, fontLgrey, historyItem].join(' ')} style={{width: 100}}>
                                {moment(historyData[hInd].date.toDateString()).fromNow()}
                            </td>

                            <td className={[historyItem].join(' ')} style={{width: 15}}>
                                <div className={cntrContent} >
                                    <img alt={"Logo history type item"}
                                         src={
                                             historyData[hInd].type === THistoryMsgType.Notification
                                                 ? logoHistoryNotification
                                         : historyData[hInd].type === THistoryMsgType.Account
                                                 ? logoHistoryAccount
                                                 : logoHistoryDevice
                                         }
                                    />
                                </div>
                            </td>

                            <td className={[h5Font, historyItem, floatl, flexG20].join(' ')}
                                style={{backgroundColor: "yellow"}}>
                                <div> {historyData[hInd].text} {historyData[hInd].text} </div>
                            </td>

                            <td className={floatr} style={{width: 20}}>
                                <IconButton onClick={e => handleSettings(e, i)} >
                                    <img src={logoSettings} alt={"HomeNet logo"}/>
                                </IconButton>
                            </td>


                            {/*<td className={floatr} style={{width: 3, position: 'relative'}}>*/}
                            {/*    {*/}
                            {/*        i !== 0 &&*/}
                            {/*        <div id={lineTop} style={{position: 'absolute'}}/>*/}
                            {/*    }*/}
                            {/*    {*/}
                            {/*        i < historyData.length - 1 &&*/}
                            {/*        <div id={lineBottom} style={{position: 'absolute'}}/>*/}
                            {/*    }*/}
                            {/*    {(i % 2 === 0 || i < 100) &&*/}
                            {/*        <div id={circle} style={{position: 'absolute'}}/>*/}
                            {/*    }*/}
                            {/*</td>*/}
                        </tr>
                    })
                }
                </tbody>
            </table>
            <Menu
                sx={{ mt: '40px',
                    // backgroundColor: "yellow",
                    border: "solid 0px rgba(0, 0, 0, 0.025)"}}
                id="menu-appbar4"
                anchorEl={values.anchorElSetting}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(values.anchorElSetting)}
                onClose={handleCloseSettings}
            >
                {settingsMenu.map((setting) => setting.show && (
                    <MenuItem
                        key={setting.name}
                        onClick={() => setting.handler()}
                    >
                        <Typography textAlign="right">{setting.name}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    </div>
}