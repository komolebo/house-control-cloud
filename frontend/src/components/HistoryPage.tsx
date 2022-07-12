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
    applyDateFromFilter,
    applyDateToFilter,
    applyTextFilter,
    applyTypeFilter,
    getIndexesFromArray,
    HISTORY_MSG_TYPES,
    historyData,
    TFilterCriteria,
    THistoryMsgType
} from "../globals/HistoryData";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {shorterMuiBtn} from "../styles/common/buttons.css";
import {cntrContent, cntrVContent, floatr} from "../styles/common/position.css";
import moment from "moment";
import logoSettings from "../assets/settings.svg";

enum EHistorySetting {
    delete,
    filterByUser,
    filterByDevice
}
interface IShowHistorySettings {
    [key: number]: {
        show: boolean;
        name: string,

    }
}
interface IHistorySettingMenu {
    clickInd: number;
    anchorElSetting: HTMLElement | null;
    setup: IShowHistorySettings;
}

interface IHistoryState {
    msgType: THistoryMsgType;
    from: Date | null,
    to: Date | null,
    keyword: string,
    filterCriteria: number;

    selection: Array<number>;
    filteredData: Array<number>;
    setting: IHistorySettingMenu
}



const initialState = {
    filteredData: getIndexesFromArray(historyData),

    // filters
    msgType: THistoryMsgType.None,
    from: null,
    to: null,
    keyword: "",
    filterCriteria: 0,

    selection: [],
    setting: {
        clickInd: -1,
        anchorElSetting: null,
        setup: {
            [EHistorySetting.delete]:
                {show: true , name: "Delete item"},
            [EHistorySetting.filterByDevice]:
                {show: false, name: "Filter by this device"},
            [EHistorySetting.filterByUser]:
                {show: false, name: "Filter by this user"}
        }
    }
};

export const HistoryPage: FC = () => {
    let [values, setValues] = useState<IHistoryState>({...initialState});

    const navigate = useNavigate();

    const applyFilters = (): Array<number> => {
        let filteredData = getIndexesFromArray(historyData);

        if (values.msgType !== THistoryMsgType.None) {
            filteredData = applyTypeFilter(filteredData, historyData, values.msgType)
        }
        if (values.keyword !== "") {
            filteredData = applyTextFilter(filteredData, historyData, values.keyword)
        }
        if (values.from) {
            filteredData = applyDateFromFilter(filteredData, historyData, values.from)
        }
        if (values.to) {
            filteredData = applyDateToFilter(filteredData, historyData, values.to)
        }
        return filteredData;
    }

    const handleMsgTypeChange = (event: SelectChangeEvent) => {
        const msgType = Number(event.target.value);
        if(msgType !== values.msgType) {
            values.msgType = msgType; // on purpose not in setValues
            setValues({ ...values, filteredData: applyFilters()})
        }
    };
    const handleChangeDateFrom = (newValue: Date | null) => {
        values.from = newValue
        setValues({...values, from: newValue, filteredData: applyFilters()});
    };
    const handleChangeDateTo = (newValue: Date | null) => {
        values.to = newValue
        setValues({...values, to: newValue, filteredData: applyFilters()});
    };
    const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        values.keyword = e.target.value;
        setValues({...values, keyword: values.keyword, filteredData: applyFilters()})
    }
    const handleSubmitKeyword = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            setValues({...values, filteredData: applyFilters()})
        }
    }
    const handleFilterByThisDevice = (ind: number) => {
        const id = historyData[ind].devId
        values.keyword = id ? id.toString() : "";
        setValues({...values, filteredData: applyFilters()})
    }
    const handleApplyKeyword = () => {
        setValues({...values, filteredData: applyFilters()})
    }
    const handleClearKeyword = () => {
        values.keyword = "";
        setValues({...values, keyword: values.keyword, filteredData: applyFilters()})
    }
    const handleClearFilters = () => {
        setValues({...initialState});
    }
    const handleCheck = (e: ChangeEvent<HTMLInputElement>, ind: number) => {
    }
    const handleOpenSettings = (event: React.MouseEvent<HTMLElement>, filteredInd: number) => {
        const hDataInd = values.filteredData[filteredInd]
        values.setting.setup[EHistorySetting.filterByDevice].show = historyData[hDataInd].devId !== undefined;
        values.setting.setup[EHistorySetting.filterByUser].show = historyData[hDataInd].uId !== undefined;
        setValues({...values,
            setting: {
                setup: values.setting.setup,
                clickInd: hDataInd,
                anchorElSetting: event.currentTarget
            }})
    }
    const handleCloseSettings = () => {
        setValues({...values, setting: {
                ...values.setting,
                anchorElSetting: null,
                clickInd: -1
            }})
    }
    const handleDeleteItem = () => {
        console.log('handleDeleteItem')
    }
    const handleFilterBySelectedItem = (criteria: TFilterCriteria) => {
        const devInfo = criteria === TFilterCriteria.By_user
            ? `\`${historyData[values.setting.clickInd].uId}\``
            : `\`${historyData[values.setting.clickInd].devId}\``
        if (devInfo) {
            values.keyword = values.keyword ? values.keyword + '+' + devInfo : devInfo;
            setValues ({...values,
                filterCriteria: values.filterCriteria | criteria,
                filteredData: applyFilters(),
                setting: {...values.setting, anchorElSetting: null}})
        }
    }

    console.log("Draw values", values)
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
                <IconButton onClick={handleApplyKeyword}
                            // type="submit"
                            sx={{ pl: '10px' }}>
                    <SearchIcon/>
                </IconButton>
                <InputBase
                    onSubmit={e => { e.preventDefault(); }}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by keyword"
                    value={values.keyword}
                    color={"info"}
                    onChange={handleChangeKeyword}
                    onKeyPress={handleSubmitKeyword}
                    // onKeyDown={handleSubmitKeyword}
                />
                <IconButton onClick={handleClearKeyword}
                            sx={{ p: '10px' }}>
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
                    label="To"
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
            <table style={{width: "100%", border: 0}}>
                <tbody>
                {
                    values.filteredData.map((hInd, i) => {
                        return <tr id={historyTableRow} key={i}>
                            <td>
                                <Checkbox className={historyItem} sx={{width: 20}} onChange={e => handleCheck(e, i)} />
                            </td>

                            <td className={[h5Font, fontLgrey, historyItem].join(' ')}
                                style={{width: 90}}>
                                {moment(historyData[hInd].date.toDateString()).fromNow()}
                            </td>

                            <td className={[historyItem].join(' ')} style={{width: 20}}>
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

                            <td className={[h5Font, historyItem].join(' ')}>
                                {historyData[hInd].text}
                            </td>

                            <td className={[floatr, historyItem, cntrVContent].join(' ')} style={{width: 10}}>
                                <IconButton  onClick={e => handleOpenSettings(e, i)} >
                                    <img src={logoSettings} alt={"HomeNet logo"}/>
                                </IconButton>
                            </td>
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
                anchorEl={values.setting.anchorElSetting}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(values.setting.anchorElSetting)}
                onClose={handleCloseSettings}
            >
                <MenuItem key={values.setting.setup[EHistorySetting.delete].name}
                          onClick={handleDeleteItem}>
                    <Typography>Delete item</Typography>
                </MenuItem>
                { values.setting.setup[EHistorySetting.filterByDevice].show &&
                    !(values.filterCriteria & TFilterCriteria.By_device) &&
                    <MenuItem onClick={() => handleFilterBySelectedItem(TFilterCriteria.By_device)}>
                        <Typography>{values.setting.setup[EHistorySetting.filterByDevice].name}</Typography>
                    </MenuItem>
                }
                { values.setting.setup[EHistorySetting.filterByUser].show &&
                    !(values.filterCriteria & TFilterCriteria.By_user) &&
                    <MenuItem onClick={() => handleFilterBySelectedItem(TFilterCriteria.By_user)}>
                        <Typography>{values.setting.setup[EHistorySetting.filterByUser].name}</Typography>
                    </MenuItem>
                }
            </Menu>
        </div>
    </div>
}