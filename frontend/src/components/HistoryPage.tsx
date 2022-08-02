import React, {ChangeEvent, FC, useContext, useEffect, useRef, useState} from "react";
import {fontLgrey, h4Font, h5Font, helpText, hFont} from "../styles/common/fonts.css";
import {historyItem, historyTable, historyTableHead, historyTableRow} from "../styles/HistoryPage.css"
import {
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    IconButton,
    InputAdornment,
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
import logoHistoryNotification from "../assets/history-item-notification.svg";
import logoHistoryAccount from "../assets/history-item-account.svg";
import logoHistoryDevice from "../assets/history-item-device.svg";
import {HISTORY_PAGE} from "../utils/consts";
import {
    applyDateFromFilter,
    applyDateToFilter,
    applyIdFilters,
    applyTextFilter,
    applyTypeFilter,
    getIndexesFromArray,
    HISTORY_MSG_TYPES,
    IHistoryItem, PAGE_ENTRIES_NUM,
    TFilterCriteria,
    THistoryMsgType
} from "../globals/HistoryData";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {shorterMuiBtn, shortMuiBtn} from "../styles/common/buttons.css";
import {cntrContent, cntrVContent, flexG1, floatr} from "../styles/common/position.css";
import moment from "moment";
import logoSettings from "../assets/settings.svg";
import {nestDeleteUserHistory, nestGetPagingHistoryPerUser} from "../http/rqData";
import {UserGlobalContext} from "../globals/UserAuthProvider";
import {NavSeq} from "./NavSeq";
import {commonPage} from "../styles/common/pages.css";
import logoLoadMore from "../assets/arrow-down-blue.svg";
import {ReactComponent as LogoMenuDelete} from '../assets/delete-item.svg';
import {ReactComponent as LogoMenuFilter} from '../assets/menu-item-filter.svg';

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

interface IFilterState {
    filteredIndexes: Array<number>,
    msgType: string;
    from: Date | undefined | null,
    to: Date | undefined | null,
    keyword: string,
    filterDevId: string;
    filterUid: string;
}
interface IHistoryState {
    editMode: boolean;

    selection: Array<number>; // contain indexes of filtered data
    setting: IHistorySettingMenu;

    offsetStep: number;
    moreData: boolean;
}


let historyData: Array<IHistoryItem> = []
export const BOARD_FILTER_HELP_WORD = "board:"
export const USER_FILTER_HELP_WORD = "user:"

const initialState = {
    editMode: false,

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
    },

    offsetStep: 0,
    moreData: true,
};
const initialFilterState: IFilterState = {
    // filters
    msgType: THistoryMsgType[THistoryMsgType.None],
    from: null,
    to: null,
    keyword: "",
    filterDevId: "",
    filterUid: "",
    filteredIndexes: [],
}


export const HistoryPage: FC = () => {
    let [state, setState] = useState<IHistoryState>({...initialState});
    let [filterState, setFilterState] = useState<IFilterState>(initialFilterState)
    const {userInfo} = useContext(UserGlobalContext)

    useEffect(() => {
        loadMore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filterAndUpdateView = () => {
        const filterResult = applyFilters();

        // if no data visible and still data on serve => load more
        // attention: recursive call
        if (!filterResult.length && state.moreData) {
            loadMore()
        } else {
            setFilterState({...filterState, filteredIndexes: filterResult})
        }

    }
    const loadMore = () => {
        if (!state.moreData) return;

        const nextOffset = state.offsetStep * PAGE_ENTRIES_NUM;

        userInfo && nestGetPagingHistoryPerUser(userInfo.id, PAGE_ENTRIES_NUM, nextOffset)
            .then(resp => {
                if (resp.status === 200) {
                    const newEntries = resp.data;
                    historyData = historyData.concat(newEntries)

                    if (newEntries.length < PAGE_ENTRIES_NUM) {
                        state.moreData = false;
                        setState({...state})
                    }

                    state.offsetStep += 1
                    filterAndUpdateView();
                }
            })
    }

    const applyFilters = (): Array<number> => {
        let filterResult = getIndexesFromArray(historyData);

        if (filterState.msgType !== THistoryMsgType[THistoryMsgType.None]) {
            filterResult = applyTypeFilter(filterResult, historyData, filterState.msgType)
        }
        if (filterState.keyword !== "") {
            filterResult = applyTextFilter(filterResult, historyData, filterState.keyword)
        }
        if (filterState.from) {
            filterResult = applyDateFromFilter(filterResult, historyData, filterState.from)
        }
        if (filterState.to) {
            filterResult = applyDateToFilter(filterResult, historyData, filterState.to)
        }
        if (filterState.filterUid || filterState.filterDevId) {
            filterResult = applyIdFilters(filterResult, historyData, filterState.filterUid, filterState.filterDevId)
        }
        return filterResult;
    }

    const handleMsgTypeChange = (event: SelectChangeEvent) => {
        const msgType = event.target.value;
        if(msgType !== filterState.msgType) {
            filterState.msgType = msgType; // on purpose not in setState
            filterAndUpdateView();
        }
    };
    const handleChangeDateFrom = (newValue: Date | undefined) => {
        filterState.from = newValue
        filterState.from?.setHours(23, 59, 59)
        filterAndUpdateView();
    };
    const handleChangeDateTo = (newValue: Date | undefined) => {
        filterState.to = newValue
        filterState.to?.setHours(23, 59, 59)
        filterAndUpdateView();
    };
    const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        filterState.keyword = e.target.value;
        filterAndUpdateView();
    }
    const handleSubmitKeyword = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            filterAndUpdateView();
        }
    }
    const handleApplyKeyword = () => {
        filterAndUpdateView();
    }
    const handleClearKeyword = () => {
        filterState.keyword = "";
        filterAndUpdateView()
    }
    const handleClearFilters = () => {
        filterState = {...initialFilterState}
        filterAndUpdateView();
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
        state.selection = []//.splice(0,state.selection.length);
        state.editMode = false
        updateView && setState({...state})
    }
    const handleOpenSettings = (event: React.MouseEvent<HTMLElement>, filteredInd: number) => {
        const hDataInd = filterState.filteredIndexes[filteredInd]
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
                ...state.setting, anchorElSetting: null, clickInd: -1
            }})
    }
    const handleDeleteByInd = () => {
        const ind = filterState.filteredIndexes[state.setting.clickInd]

        historyData[ind].text = "Deleted";
        userInfo && nestDeleteUserHistory(userInfo.id, [historyData[ind].id]).then(resp => {
            console.log("history deleted")
            filterAndUpdateView()
        })
        filterAndUpdateView();
    }
    const handleDeleteMultiple = () => {
        userInfo && nestDeleteUserHistory(userInfo.id, state.selection.map(ind => historyData[ind].id))
            .then(resp => {
                state.selection = []
                state.editMode = false;
                console.log("history deleted")
                filterAndUpdateView()
        })
    }
    const handleSelectAll = () => {
        setState({...state, selection: [...filterState.filteredIndexes]})
    }

    const handleFilterBySelectedItem = (clickInd: number, criteria: TFilterCriteria) => {
        clearSelection(false);
        if (criteria === TFilterCriteria.By_user) {
            const val = historyData[clickInd].uId;
            filterState.filterUid = val ? val.toString() : "";
        } else if (criteria === TFilterCriteria.By_device) {
            const val = historyData[clickInd].devId;
            filterState.filterDevId = val ? val.toString() : "";
        }
        filterAndUpdateView()
    }

    const handleClearIdFilter = (criteria: TFilterCriteria) => {
        if (criteria & TFilterCriteria.By_device) {
            filterState.filterDevId = "";
        } else if (criteria & TFilterCriteria.By_user) {
            filterState.filterUid = "";
        }
        filterAndUpdateView();
    }

    return <div className={commonPage}>
        <div className={hFont}>History</div>
        <div className={helpText}>Here you can view device actions history or your activitivity</div><br/>

        <NavSeq currentPage={HISTORY_PAGE}/><br/>

        {!state.editMode
            ? <div id={historyTableHead}>
            <FormControl sx={{width: 150}}>
                <InputLabel id="demo-simple-select-label2">Filter</InputLabel>
                <Select
                    labelId="label-simple-select-msgtype"
                    id="simple-select-msgtype"
                    value={filterState.msgType !== THistoryMsgType[THistoryMsgType.None] ? filterState.msgType : ""}
                    label="Filter"
                    onChange={handleMsgTypeChange}
                >
                    {
                        HISTORY_MSG_TYPES.map ((msgType, i) => {
                            return <MenuItem key={i} value={msgType}>
                                <Typography>{msgType}</Typography>
                            </MenuItem>
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
                            sx={{pl: 1}}>
                    <SearchIcon/>
                </IconButton>
                <InputBase
                    onSubmit={e => {
                        e.preventDefault ();
                    }}
                    sx={{flex: 1}}
                    placeholder="Search by keyword"
                    value={filterState.keyword}
                    color={"info"}
                    onChange={handleChangeKeyword}
                    onKeyPress={handleSubmitKeyword}
                    // onKeyDown={handleSubmitKeyword}
                    startAdornment={
                        <InputAdornment position="end" sx={{mr: 1}}>
                            {filterState.filterDevId ?
                                <Chip
                                    label={filterState.filterDevId}
                                    color={"primary"}
                                    variant="outlined"
                                    onDelete={() => handleClearIdFilter(TFilterCriteria.By_device)}
                                /> : <></>
                            }
                            {filterState.filterUid ?
                                <Chip sx={{ml: 1}}
                                      label={filterState.filterUid}
                                      color={"primary"}
                                      variant="outlined"
                                      onDelete={() => handleClearIdFilter(TFilterCriteria.By_user)}
                                /> : <></>
                            }
                        </InputAdornment>
                    }
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
                        value={filterState.from}
                        onChange={date => handleChangeDateFrom(date ? date : undefined)}
                        maxDate={filterState.to ? filterState.to : undefined}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>

            <Box sx={{mr: 3, ml: 3, maxWidth: 150}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label="To"
                        inputFormat="MM/dd/yyyy"
                        value={filterState.to}
                        minDate={filterState.from}
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
                                onClick={() => clearSelection(true)}>
                        <ClearIcon/>
                    </IconButton>
                    <div className={[h4Font, cntrVContent].join(' ')}>Selected: {state.selection.length}</div>
                </div>

                <div>
                    <Button variant={"text"}
                            className={[shorterMuiBtn].join(' ')}
                            onClick={handleDeleteMultiple}
                    > Remove
                    </Button>
                </div>
                <div>
                    <Button variant={"outlined"}
                            className={[shorterMuiBtn].join(' ')}
                            onClick={handleSelectAll}
                    > Select all
                    </Button>
                </div>
            </div>
        }

        <div id={historyTable}>
            <table style={{width: "100%", border: 0}}>
                <tbody>
                {
                    historyData.length ? filterState.filteredIndexes.map((hInd, i) => {
                        return <tr id={historyTableRow} key={i}>
                            <td className={historyItem} style={{ width: 40, paddingRight: 5}}>
                                <Checkbox
                                    className={historyItem} sx={{width: 40}}
                                    onChange={e => handleCheck(e, hInd)}
                                    checked={state.selection.includes(hInd)}
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
                                    { historyData[hInd].devId && !filterState.filterDevId ?
                                        <Chip
                                            label={`${BOARD_FILTER_HELP_WORD}${historyData[hInd].devId}`}
                                            color="default"
                                            variant={"outlined"}
                                            sx={{opacity: 0.5, m: "0 2px"}}
                                            onClick={() => handleFilterBySelectedItem(hInd, TFilterCriteria.By_device)}
                                        /> : <></>
                                    }
                                    { historyData[hInd].uId && !filterState.filterUid ?
                                        <Chip
                                            label={`${USER_FILTER_HELP_WORD}${historyData[hInd].uId}`}
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
            { state.moreData
                ? <div className={cntrContent}>

                    <Button variant={"outlined"}
                            sx={{mt: 1}}
                            onClick={loadMore}
                            startIcon={
                                <img src={logoLoadMore} alt={"Load more entries"}/>
                            }
                    > Load more
                    </Button>
                </div> : <></>
            }

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
                    <Box
                        sx={{mr: 2, width: 24}}
                        className={cntrContent}
                    >
                        <LogoMenuDelete fill="currentColor"/>
                    </Box>
                    <Typography>Delete item</Typography>
                </MenuItem>
                { state.setting.setup[EHistorySetting.filterByDevice].show &&
                    !filterState.filterDevId &&
                    <MenuItem onClick={() => {
                            handleFilterBySelectedItem (state.setting.clickInd, TFilterCriteria.By_device);
                            handleCloseSettings();
                        }
                    }>
                        <Box
                            sx={{mr: 2, width: 24}}
                            className={cntrContent}
                        >
                            <LogoMenuFilter fill="currentColor"/>
                        </Box>
                        <Typography>{state.setting.setup[EHistorySetting.filterByDevice].name}</Typography>
                    </MenuItem>
                }
                { state.setting.setup[EHistorySetting.filterByUser].show &&
                    !filterState.filterUid &&
                    <MenuItem onClick={() => {
                        handleFilterBySelectedItem (state.setting.clickInd, TFilterCriteria.By_user);
                        handleCloseSettings();
                    }}>
                        <Box
                            sx={{mr: 2, width: 24}}
                            className={cntrContent}
                        >
                            <LogoMenuFilter fill="currentColor"/>
                        </Box>
                        <Typography>{state.setting.setup[EHistorySetting.filterByUser].name}</Typography>
                    </MenuItem>
                }
            </Menu>
        </div>
    </div>
}