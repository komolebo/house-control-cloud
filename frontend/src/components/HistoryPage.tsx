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
    }
}
interface IHistorySettingMenu {
    clickInd: number;
    anchorElSetting: HTMLElement | null;
    setup: IShowHistorySettings;
}

interface IHistoryState {
    filteredIndexes: Array<number>,
    editMode: boolean;
    msgType: string;
    from: Date | undefined | null,
    to: Date | undefined | null,
    keyword: string,
    filterCriteria: number;

    selection: Array<number>; // contain indexes of filtered data
    setting: IHistorySettingMenu
}


const userInfo = getUserInfo();
let historyData: Array<IHistoryItem> = []

const initialState = {
    filteredIndexes: [],
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
                {show: true , name: "Delete item"},
            [EHistorySetting.filterByDevice]:
                {show: false, name: "Filter by this device"},
            [EHistorySetting.filterByUser]:
                {show: false, name: "Filter by this user"},
        }
    }
};

export const HistoryPage: FC = () => {
    let [state, setState] = useState<IHistoryState>({...initialState});

    const navigate = useNavigate();

    useEffect(() => {
        syncData();
    }, [])

    const initView = () => {
        setState({...state, filteredIndexes: applyFilters()})
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

    const applyFilters = (): Array<number> => {
        let filterResult = getIndexesFromArray(historyData);

        if (state.msgType !== THistoryMsgType[THistoryMsgType.None]) {
            filterResult = applyTypeFilter(filterResult, historyData, state.msgType)
        }
        if (state.keyword !== "") {
            filterResult = applyTextFilter(filterResult, historyData, state.keyword)
        }
        if (state.from) {
            filterResult = applyDateFromFilter(filterResult, historyData, state.from)
        }
        if (state.to) {
            filterResult = applyDateToFilter(filterResult, historyData, state.to)
        }
        return filterResult;
    }

    const handleMsgTypeChange = (event: SelectChangeEvent) => {
        const msgType = event.target.value;
        if(msgType !== state.msgType) {
            state.msgType = msgType; // on purpose not in setState
            initView();
        }
    };
    const handleChangeDateFrom = (newValue: Date | undefined) => {
        state.from = newValue
        initView();
    };
    const handleChangeDateTo = (newValue: Date | undefined) => {
        state.to = newValue
        initView();
    };
    const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        state.keyword = e.target.value;
        initView();
    }
    const handleSubmitKeyword = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            initView();
        }
    }
    const handleApplyKeyword = () => {
        initView();
    }
    const handleClearKeyword = () => {
        state.keyword = "";
        state.filterCriteria = 0;
        initView();
    }
    const handleClearFilters = () => {
        state = {...initialState}
        initView();
    }
    const handleCheck = (e: ChangeEvent<HTMLInputElement>, filteredInd: number) => {
        if (e.target.checked) {
            state.selection.push(filteredInd)
        } else {
            state.selection = state.selection.filter(el => el !== filteredInd)
        }
        state.editMode = state.selection.length > 0;
        setState({...state})
    }
    const clearSelection = (updateView = true) => {
        state.selection.splice(0,state.selection.length);
        state.editMode = false
        updateView && setState({...state})
    }
    const handleOpenSettings = (event: React.MouseEvent<HTMLElement>, filteredInd: number) => {
        const hDataInd = state.filteredIndexes[filteredInd]
        state.setting.setup[EHistorySetting.filterByDevice].show = Boolean(historyData[hDataInd].devId);
        state.setting.setup[EHistorySetting.filterByUser].show = Boolean(historyData[hDataInd].uId)
        setState({...state,
            setting: {
                setup: state.setting.setup,
                clickInd: hDataInd,
                anchorElSetting: event.currentTarget
            }})
    }
    const handleCloseSettings = () => {
        setState({...state, setting: {
                ...state.setting,
                anchorElSetting: null,
                clickInd: -1
            }})
    }
    const handleDeleteByInd = () => {
        const ind = state.filteredIndexes[state.setting.clickInd]

        historyData[ind].text = "Deleted";
        initView();
    }
    const handleDeleteAll = () => {
        state.selection.map(ind => {
            historyData[ind].text = "Delete by list"
        })
        state.selection = []
        initView();
    }

    const handleFilterBySelectedItem = (clickInd: number, criteria: TFilterCriteria) => {
        clearSelection(false);
        const newWord = criteria === TFilterCriteria.By_user
            ? `${USER_FILTER_RESERV_WORD}${historyData[clickInd].uId}+`
            : `${BOARD_FILTER_RESERV_WORD}${historyData[clickInd].devId}+`
        if (newWord) {
            state.keyword = state.keyword ? state.keyword + '+' + newWord : newWord;
            state.filterCriteria |= criteria;
            state.setting.anchorElSetting = null;
            initView()
        }
    }

    return <div id={historyPage}>
        <div className={hFont}>History</div>
        <div className={helpText}>Here you can view device actions history or your activitivity</div><br/>

        <IconButton color="inherit" onClick={() => navigate(HOME_PAGE)}>
            <img src={logoBackToHome} alt={"Back to home"} />
            <div className={h5Font}>
                &nbsp;Home
            </div>
        </IconButton><br/><br/><br/>

        {!state.editMode ?
            <div id={historyTableHead}>
            <FormControl sx={{width: 150}}>
                <InputLabel id="demo-simple-select-label2">Filter</InputLabel>
                <Select
                    labelId="label-simple-select-msgtype"
                    id="simple-select-msgtype"
                    value={state.msgType !== THistoryMsgType[THistoryMsgType.None] ? state.msgType : ""}
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
                    borderRadius: "6px ",
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
                    value={state.keyword}
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
                        value={state.from}
                        onChange={date => handleChangeDateFrom(date ? date : undefined)}
                        maxDate={state.to ? state.to : undefined}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>

            <Box sx={{mr: 3, ml: 3, maxWidth: 150}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label="To"
                        inputFormat="MM/dd/yyyy"
                        value={state.to}
                        minDate={state.from}
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
                    <div className={[h4Font, cntrVContent].join(' ')}>Selected: {state.selection.length}</div>
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
            <table style={{width: "100%", border: 0}} >
                <tbody>
                {
                    historyData.length ? state.filteredIndexes.map((hInd, i) => {
                        return <tr id={historyTableRow} key={i}>
                            <td className={historyItem} style={{ width: 40, paddingRight: 5}}>
                                <Checkbox
                                    className={historyItem} sx={{width: 40}}
                                    onChange={e => handleCheck(e, i)}
                                    checked={state.selection.includes(i)}
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
                                style={{padding: "0 10px"}}>

                            <div style={{display: "flex", flexDirection: "row"}}>
                                { historyData[hInd].devId && !(state.filterCriteria & TFilterCriteria.By_device) ?
                                    <Chip
                                        label={`${BOARD_FILTER_RESERV_WORD}${historyData[hInd].devId}`}
                                        color="default"
                                        variant={"outlined"}
                                        sx={{opacity: 0.5, m: "0 2px"}}
                                        onClick={() => handleFilterBySelectedItem(hInd, TFilterCriteria.By_device)}
                                    /> : <></>
                                }
                                { historyData[hInd].uId && !(state.filterCriteria & TFilterCriteria.By_user) ?
                                    <Chip
                                        label={`${USER_FILTER_RESERV_WORD}${historyData[hInd].uId}`}
                                        color="default"
                                        variant={"outlined"}
                                        sx={{opacity: 0.5, m: "0 2px"}}
                                        onClick={() => handleFilterBySelectedItem(hInd, TFilterCriteria.By_user)}
                                    /> : <></>
                                }

                                <IconButton style={{padding: 0, paddingLeft: 10}}   onClick={e => handleOpenSettings(e, i)} >
                                    <img src={logoSettings} alt={"Settings logo"}/>
                                </IconButton>
                            </div>
                            </td>
                        </tr>
                    }) : <></>
                }
                </tbody>
            </table>
            <Menu
                sx={{ mt: '40px',
                    // backgroundColor: "yellow",
                    border: "solid 0px rgba(0, 0, 0, 0.025)"}}
                id="menu-appbar4"
                anchorEl={state.setting.anchorElSetting}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(state.setting.anchorElSetting)}
                onClose={handleCloseSettings}
            >
                <MenuItem key={state.setting.setup[EHistorySetting.delete].name}
                          onClick={() => {
                              handleDeleteByInd();
                              handleCloseSettings();
                          }}>
                    <Typography>Delete item</Typography>
                </MenuItem>
                { state.setting.setup[EHistorySetting.filterByDevice].show &&
                    !(state.filterCriteria & TFilterCriteria.By_device) &&
                    <MenuItem onClick={() => {
                            handleFilterBySelectedItem (state.setting.clickInd, TFilterCriteria.By_device);
                            handleCloseSettings();
                        }
                    }>
                        <Typography>{state.setting.setup[EHistorySetting.filterByDevice].name}</Typography>
                    </MenuItem>
                }
                { state.setting.setup[EHistorySetting.filterByUser].show &&
                    !(state.filterCriteria & TFilterCriteria.By_user) &&
                    <MenuItem onClick={() => {
                        handleFilterBySelectedItem (state.setting.clickInd, TFilterCriteria.By_user);
                        handleCloseSettings();
                    }}>
                        <Typography>{state.setting.setup[EHistorySetting.filterByUser].name}</Typography>
                    </MenuItem>
                }
            </Menu>
        </div>
    </div>
}