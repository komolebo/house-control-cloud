import React, {ChangeEvent, FC, useEffect, useState} from "react";
import {fontLgrey, h4Font, h5Font, helpText, hFont} from "../styles/common/fonts.css";
import {historyItem, historyPage, historyTable, historyTableHead, historyTableRow} from "../styles/HistoryPage.css"
import {
    Box,
    Button,
    Checkbox,
    Chip,
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
    applyTypeFilter, BOARD_FILTER_RESERV_WORD,
    getIndexesFromArray,
    HISTORY_MSG_TYPES,
    IHistoryItem,
    TFilterCriteria,
    THistoryMsgType, USER_FILTER_RESERV_WORD
} from "../globals/HistoryData";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {shorterMuiBtn} from "../styles/common/buttons.css";
import {cntrContent, cntrVContent, flexG1, floatr} from "../styles/common/position.css";
import moment from "moment";
import logoSettings from "../assets/settings.svg";
import {postGetHistoryPerUser} from "../http/rqData";
import {getUserInfo} from "../globals/UserAuthProvider";


enum EHistorySetting {
    delete,
    filterByUser,
    filterByDevice
}
interface IShowHistorySettings {
    [key: number]: {
        show: boolean,
        name: string,
        set: boolean
    }
}
interface IHistorySettingMenu {
    clickInd: number;
    anchorElSetting: HTMLElement | null;
    setup: IShowHistorySettings;
}

interface IHistoryState {
    editMode: boolean;
    msgType: string;
    from: Date | undefined | null,
    to: Date | undefined | null,
    keyword: string,
    filterCriteria: number;

    selection: Array<number>; // contain indexes of filtered data
    filteredIndexes: Array<number>;
    setting: IHistorySettingMenu
}


const userInfo = getUserInfo();
let historyData: Array<IHistoryItem> = []
const initialState = {
    filteredIndexes: getIndexesFromArray(historyData),
    editMode: false,

    // filters
    msgType: THistoryMsgType[THistoryMsgType.None],
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
                {show: true , name: "Delete item", set: false},
            [EHistorySetting.filterByDevice]:
                {show: false, name: "Filter by this device name", set: false},
            [EHistorySetting.filterByUser]:
                {show: false, name: "Filter by this user name", set: false}
        }
    }
};

export const HistoryPage: FC = () => {
    let [values, setValues] = useState<IHistoryState>({...initialState});
    const navigate = useNavigate();

    const initView = () => {
        values = {...initialState}
        setValues({...values, filteredIndexes: applyFilters()});
    }
    const syncData = () => {
        userInfo && postGetHistoryPerUser().then(resp => {
            if(resp.status === 200 || resp.status === 201) {
                console.log("history records:", resp.data)
                historyData = [...resp.data]
                historyData.forEach(el => {
                    el.createdAt = new Date(el.createdAt)
                    el.createdAt.setHours(0,0,0,0)
                })
                initView()
            }
        })
    }

    useEffect(() => {
        syncData();
    }, [])

    const applyFilters = (): Array<number> => {
        let filteredIndexes = getIndexesFromArray(historyData);

        if (values.msgType !== THistoryMsgType[THistoryMsgType.None]) {
            filteredIndexes = applyTypeFilter(filteredIndexes, historyData, values.msgType)
        }
        if (values.keyword !== "") {
            filteredIndexes = applyTextFilter(filteredIndexes, historyData, values.keyword)
        }
        if (values.from) {
            filteredIndexes = applyDateFromFilter(filteredIndexes, historyData, values.from)
        }
        if (values.to) {
            filteredIndexes = applyDateToFilter(filteredIndexes, historyData, values.to)
        }
        return filteredIndexes;
    }

    const handleMsgTypeChange = (event: SelectChangeEvent) => {
        const msgType = event.target.value;
        if(msgType !== values.msgType) {
            values.msgType = msgType; // on purpose not in setValues
            setValues({ ...values, filteredIndexes: applyFilters()})
        }
    };
    const handleChangeDateFrom = (newValue: Date | undefined) => {
        values.from = newValue
        setValues({...values, from: newValue, filteredIndexes: applyFilters()});
    };
    const handleChangeDateTo = (newValue: Date | undefined) => {
        values.to = newValue
        setValues({...values, to: newValue, filteredIndexes: applyFilters()});
    };
    const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        values.keyword = e.target.value;
        setValues({...values, keyword: values.keyword, filteredIndexes: applyFilters()})
    }
    const handleSubmitKeyword = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            setValues({...values, filteredIndexes: applyFilters()})
        }
    }
    const handleFilterByThisDevice = (ind: number) => {
        const id = historyData[ind].devId
        values.keyword = id ? id.toString() : "";
        setValues({...values, filteredIndexes: applyFilters()})
    }
    const handleApplyKeyword = () => {
        setValues({...values, filteredIndexes: applyFilters()})
    }
    const handleClearKeyword = () => {
        values.keyword = "";
        values.filterCriteria = 0;
        setValues({...values, keyword: values.keyword, filteredIndexes: applyFilters()})
    }
    const handleClearFilters = () => {
        initView();
    }
    const handleCheck = (e: ChangeEvent<HTMLInputElement>, filteredInd: number) => {
        console.log(filteredInd)
        if (e.target.checked) {
            values.selection.push(filteredInd)
        } else {
            values.selection = values.selection.filter(el => el !== filteredInd)
        }
        values.editMode = values.selection.length > 0;
        setValues({...values})
    }
    const clearSelection = (updateView = true) => {
        values.selection.splice(0,values.selection.length);
        values.editMode = false
        updateView && setValues({...values})
    }
    const handleOpenSettings = (event: React.MouseEvent<HTMLElement>, filteredInd: number) => {
        console.log("handleOpenSettings")
        const hDataInd = values.filteredIndexes[filteredInd]
        values.setting.setup[EHistorySetting.filterByDevice].show = Boolean(historyData[hDataInd].devId);
        values.setting.setup[EHistorySetting.filterByUser].show = Boolean(historyData[hDataInd].uId)
        setValues({...values,
            setting: {
                setup: values.setting.setup,
                clickInd: hDataInd,
                anchorElSetting: event.currentTarget
            }})
    }
    const handleCloseSettings = () => {
        console.log("handleCloseSettings")
        setValues({...values, setting: {
                ...values.setting,
                anchorElSetting: null,
                clickInd: -1
            }})
    }
    const handleDeleteByInd = () => {
        console.log("handleDeleteByInd")
        const ind = values.filteredIndexes[values.setting.clickInd]

        historyData[ind].text = "Deleted";
        setValues({...values, filteredIndexes: applyFilters()})
    }
    const handleDeleteAll = () => {
        console.log("handleDeleteByInd")
        values.selection.map(ind => {
            historyData[ind].text = "Delete by list"
        })
        values.selection = []
        setValues({...values, filteredIndexes: applyFilters()})
    }

    const handleFilterBySelectedItem = (clickInd: number, criteria: TFilterCriteria) => {
        console.log(values.setting.clickInd);
        clearSelection(false);
        const newWord = criteria === TFilterCriteria.By_user
            ? `${USER_FILTER_RESERV_WORD}${historyData[clickInd].uId}+`
            : `${BOARD_FILTER_RESERV_WORD}${historyData[clickInd].devId}+`
        if (newWord) {
            values.keyword = values.keyword ? values.keyword + '+' + newWord : newWord;
            values.filteredIndexes = applyFilters()
            values.filterCriteria |= criteria;
            setValues ({...values,
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

        {!values.editMode ?
            <div id={historyTableHead}>
            <FormControl sx={{width: 150}}>
                <InputLabel id="demo-simple-select-label2">Filter</InputLabel>
                <Select
                    labelId="label-simple-select-msgtype"
                    id="simple-select-msgtype"
                    value={values.msgType !== THistoryMsgType[THistoryMsgType.None] ? values.msgType : ""}
                    label="Filter"
                    onChange={handleMsgTypeChange}
                >
                    {
                        HISTORY_MSG_TYPES.map ((msgType, i) => {
                            return <MenuItem key={i} value={msgType}>{msgType}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>

            <Paper
                component="form"
                sx={{
                    p: '2px 4px', ml: 3, mr: 3, display: 'flex',
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
                            sx={{pl: '10px'}}>
                    <SearchIcon/>
                </IconButton>
                <InputBase
                    onSubmit={e => {
                        e.preventDefault ();
                    }}
                    sx={{ml: 1, flex: 1}}
                    placeholder="Search by keyword"
                    value={values.keyword}
                    color={"info"}
                    onChange={handleChangeKeyword}
                    onKeyPress={handleSubmitKeyword}
                    // onKeyDown={handleSubmitKeyword}
                />
                <IconButton onClick={handleClearKeyword}
                            sx={{p: '10px'}}>
                    <ClearIcon/>
                </IconButton>
            </Paper>

            <Box sx={{maxWidth: 150, flexDirection: "row"}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label="From"
                        inputFormat="MM/dd/yyyy"
                        value={values.from}
                        onChange={date => handleChangeDateFrom(date ? date : undefined)}
                        maxDate={values.to ? values.to : undefined}
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
                        minDate={values.from}
                        onChange={date => handleChangeDateTo(date ? date : undefined)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>


            <div className={[cntrVContent, floatr].join (' ')}>
                <Button variant={"text"}
                        sx={{flexGrow: 1}}
                        className={shorterMuiBtn}
                        onClick={() => handleClearFilters ()}
                > Clear filters
                </Button>
            </div>
            </div>
            : <div id={historyTableHead}>
                <div className={flexG1} style={{display: "flex"}}>
                    <IconButton sx={{p: '10px', ml: 2}}
                                onClick={() => clearSelection()}>
                        <ClearIcon/>
                    </IconButton>
                    <div className={[h4Font, cntrVContent].join(' ')}>Selected: {values.selection.length}</div>
                </div>

                <div>
                    <Button variant={"text"}
                            className={[shorterMuiBtn].join(' ')}
                            onClick={handleDeleteAll}
                    > Remove
                    </Button>
                </div>
            </div>
        }

        <div id={historyTable}>
            <table style={{width: "100%", border: 0}}>
                <tbody>
                {
                    values.filteredIndexes.map((hInd, i) => {
                        return <tr id={historyTableRow} key={i}>
                            <td className={historyItem} style={{width: 40, paddingRight: 5}}>
                                <Checkbox
                                    className={historyItem} sx={{width: 40}}
                                    onChange={e => handleCheck(e, i)}
                                    checked={values.selection.includes(i)}
                                />
                            </td>

                            <td className={[h5Font, fontLgrey, historyItem].join(' ')}
                                style={{width: 120}}>
                                {moment(historyData[hInd].createdAt).fromNow()}
                            </td>

                            <td className={[historyItem].join(' ')} style={{width: 20}}>
                                <div className={cntrContent} >
                                    <img alt={"Logo history type item"}
                                         src={
                                             historyData[hInd].type === THistoryMsgType[THistoryMsgType.Notification]
                                                 ? logoHistoryNotification
                                         : historyData[hInd].type ===  THistoryMsgType[THistoryMsgType.Account]
                                                 ? logoHistoryAccount
                                                 : logoHistoryDevice
                                         }
                                    />
                                </div>
                            </td>

                            <td className={[h4Font, historyItem].join(' ')}>
                                {historyData[hInd].text}
                            </td>

                            <td className={[floatr, historyItem, cntrVContent].join(' ')}
                                style={{width: 20,  padding: "0 10px"}}>
                                <IconButton style={{padding: 0}}   onClick={e => handleOpenSettings(e, i)} >
                                    <img src={logoSettings} alt={"Settings logo"}/>
                                </IconButton>
                            </td>
                            <td  className={[floatr, historyItem].join(' ')}>
                                { historyData[hInd].devId && !(values.filterCriteria & TFilterCriteria.By_device) ?
                                    <Chip
                                        label={`${BOARD_FILTER_RESERV_WORD}:${historyData[hInd].devId}`}
                                        color="default"
                                        variant={"outlined"}
                                        sx={{opacity: 0.5}}
                                        onClick={() => handleFilterBySelectedItem(hInd, TFilterCriteria.By_device)}
                                    />
                                    : <></>
                                }
                                &nbsp;
                                { historyData[hInd].uId && !(values.filterCriteria & TFilterCriteria.By_user) ?
                                    <Chip
                                        label={`${USER_FILTER_RESERV_WORD}:${historyData[hInd].uId}`}
                                        color="default"
                                        variant={"outlined"}
                                        sx={{opacity: 0.5}}
                                        onClick={() => handleFilterBySelectedItem(hInd, TFilterCriteria.By_user)}
                                    />
                                : <></>}
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
                          onClick={() => {
                              handleDeleteByInd();
                              handleCloseSettings();
                          }}>
                    <Typography>Delete item</Typography>
                </MenuItem>
                { values.setting.setup[EHistorySetting.filterByDevice].show &&
                    !(values.filterCriteria & TFilterCriteria.By_device) &&
                    <MenuItem onClick={() => {
                            handleFilterBySelectedItem (values.setting.clickInd, TFilterCriteria.By_device);
                            handleCloseSettings();
                        }
                    }>
                        <Typography>{values.setting.setup[EHistorySetting.filterByDevice].name}</Typography>
                    </MenuItem>
                }
                { values.setting.setup[EHistorySetting.filterByUser].show &&
                    !(values.filterCriteria & TFilterCriteria.By_user) &&
                    <MenuItem onClick={() => {
                        handleFilterBySelectedItem (values.setting.clickInd, TFilterCriteria.By_user);
                        handleCloseSettings();
                    }}>
                        <Typography>{values.setting.setup[EHistorySetting.filterByUser].name}</Typography>
                    </MenuItem>
                }
            </Menu>
        </div>
    </div>
}