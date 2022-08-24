import React, {ChangeEvent, FC, useContext, useEffect, useState} from "react";
import {fontLgrey, h5Font, helpText} from "../styles/common/fonts.css";
import {historyItem, historyTable, historyTableHead, historyTableRow} from "../styles/HistoryPage.css"
import {
    Box,
    Button, Card,
    Checkbox,
    Chip, FormControl, IconButton,
    InputAdornment,
    InputLabel,
    Menu,
    MenuItem, Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import logoHistoryNotification from "../assets/history-item-notification.svg";
import logoHistoryAccount from "../assets/history-item-account.svg";
import logoHistoryDevice from "../assets/history-item-device.svg";
import {HISTORY_PAGE} from "../utils/consts";
import {
    DEFAULT_HISTORY_TYPE,
    HISTORY_MSG_TYPES,
    IHistoryItem, PAGE_ENTRIES_NUM,
    TFilterCriteria,
    THistoryMsgType
} from "../globals/HistoryData";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {shorterMuiBtn} from "../styles/common/buttons.css";
import {cntrContent, cntrVContent, flexG1, floatr} from "../styles/common/position.css";
import moment from "moment";
import logoSettings from "../assets/settings.svg";
import {nestDeleteUserHistory, nestGetFilteredUserHistoryChunk} from "../http/rqData";
import {UserGlobalContext} from "../globals/providers/UserAuthProvider";
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
    msgType: string;
    from: Date | undefined | null,
    to: Date | undefined | null,
    keyword: string,
    filterDevId: string;
    filterUid: string;
}
interface IHistoryState {
    editMode: boolean;
    filteredData: Array<IHistoryItem>,

    selection: Array<number>; // contain indexes of filtered data
    setting: IHistorySettingMenu;

    offsetStep: number;
    moreData: boolean;
}


export const BOARD_FILTER_HELP_WORD = "board:"
export const USER_FILTER_HELP_WORD = "user:"

const initialState = {
    editMode: false,
    filteredData: [],

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
    msgType: DEFAULT_HISTORY_TYPE,
    from: null,
    to: null,
    keyword: "",
    filterDevId: "",
    filterUid: "",
}


export const HistoryPage: FC = () => {
    let [state, setState] = useState<IHistoryState>({...initialState});
    let [filterState, setFilterState] = useState<IFilterState>(initialFilterState)
    const {userInfo} = useContext(UserGlobalContext)
    const today = moment().toDate()

    console.log(">>>>>>>>>", state)

    useEffect(() => {
        syncData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const syncData = () => {
        if (!state.moreData) return;

        const nextOffset = state.offsetStep * PAGE_ENTRIES_NUM;

        userInfo && nestGetFilteredUserHistoryChunk(
            userInfo.id,
            PAGE_ENTRIES_NUM, nextOffset,
            filterState.msgType,
            filterState.keyword, filterState.from?.toDateString(), filterState.to?.toDateString(),
            filterState.filterUid, filterState.filterDevId
        ).then(resp => {
            if (resp.status === 201) {
                const newEntries = resp.data;
                state.filteredData = state.filteredData.concat(newEntries)

                if (newEntries.length < PAGE_ENTRIES_NUM) {
                    state.moreData = false;
                }

                state.offsetStep += 1
                setState({...state})
            }
        })
    }

    const clearLoadedData = () => {
        state.filteredData = [];
        state.moreData = true;
        state.offsetStep = 0;
    }

    const handleMsgTypeChange = (event: SelectChangeEvent) => {
        const msgType = event.target.value;
        if(msgType !== filterState.msgType) {
            filterState.msgType = msgType; // on purpose not in setState
            clearLoadedData();
            syncData();
        }
    };
    const handleChangeDateFrom = (newValue: Date | undefined) => {
        filterState.from = newValue
        filterState.from?.setHours(23, 59, 59)
        clearLoadedData();
        syncData();
    };
    const handleChangeDateTo = (newValue: Date | undefined) => {
        filterState.to = newValue
        filterState.to?.setHours(23, 59, 59)
        clearLoadedData();
        syncData();
    };
    const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
        filterState.keyword = e.target.value;
        clearLoadedData();
        syncData();
    }
    const handleSubmitKeyword = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            clearLoadedData();
            syncData();
        }
    }
    const handleApplyKeyword = () => {
        clearLoadedData();
        syncData();
    }
    const handleClearKeyword = () => {
        filterState.keyword = "";
        clearLoadedData();
        syncData();
    }
    const handleClearFilters = () => {
        filterState = {...filterState, from: null, to: null, msgType: DEFAULT_HISTORY_TYPE,
            filterDevId: "", filterUid: ""}
        setFilterState(filterState)
        clearLoadedData();
        syncData();
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
        // const hDataInd = state.filteredData[filteredInd]
        state.setting.setup[EHistorySetting.filterByDevice].show = Boolean(state.filteredData[filteredInd].devId);
        state.setting.setup[EHistorySetting.filterByUser].show = Boolean(state.filteredData[filteredInd].uId)
        setState({...state,
            setting: {
                setup: state.setting.setup,
                clickInd: filteredInd,
                anchorElSetting: event.currentTarget
            }})
    }
    const handleCloseSettings = (updateView?: boolean) => {
        state.setting.anchorElSetting = null;
        state.setting.clickInd = -1;
        if(updateView) setState({...state})
    }
    const handleDeleteByInd = () => {
        const historyId = state.filteredData[state.setting.clickInd].id;

        handleCloseSettings();
        userInfo && nestDeleteUserHistory(userInfo.id, [historyId]).then(resp => {
            console.log(resp.status)
            if (resp.status === 200) {
                console.log("history deleted")
                clearLoadedData();
                syncData()
            }
        })
    }
    const handleDeleteMultiple = () => {
        userInfo && nestDeleteUserHistory(userInfo.id, state.selection.map(ind => state.filteredData[ind].id))
            .then(resp => {
                if (resp.status === 200) {
                    state.selection = []
                    state.editMode = false;
                    console.log("history deleted")
                    clearLoadedData()
                    syncData()
                }
        })
    }
    const handleSelectAll = () => {
        setState({...state, selection: state.filteredData.map((el, i) => i)})
    }

    const handleFilterBySelectedItem = (clickInd: number, criteria: TFilterCriteria) => {
        clearSelection(false);
        handleCloseSettings();
        if (criteria === TFilterCriteria.By_user) {
            const val = state.filteredData[clickInd].uId;
            filterState.filterUid = val ? val.toString() : "";
        } else if (criteria === TFilterCriteria.By_device) {
            const val = state.filteredData[clickInd].devId;
            filterState.filterDevId = val ? val.toString() : "";
        }
        clearLoadedData();
        syncData();
    }

    const handleClearIdFilter = (criteria: TFilterCriteria) => {
        if (criteria & TFilterCriteria.By_device) {
            filterState.filterDevId = "";
        } else if (criteria & TFilterCriteria.By_user) {
            filterState.filterUid = "";
        }
        clearLoadedData();
        syncData();
    }

    return <div className={commonPage}>
        <Typography variant="h1" sx={{mb: 1}}>History</Typography>
        <Typography variant="h6" sx={{mt: 1, mb: 3}}>Here you can view device actions history or your activity</Typography>

        <NavSeq currentPage={HISTORY_PAGE}/><br/>

        {!state.editMode
            ? <div id={historyTableHead}>
            <FormControl sx={{width: 150}}>
                <InputLabel id="demo-simple-select-label2">Filter</InputLabel>
                <Select
                    labelId="label-simple-select-msgtype"
                    color={"info"}
                    id="simple-select-msgtype"
                    value={filterState.msgType !== THistoryMsgType[THistoryMsgType.None] ? filterState.msgType : ""}
                    label="Filter"
                    onChange={handleMsgTypeChange}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: "special.main",
                            }
                        }
                    }}
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

            <TextField
                id="outlined-adornment-password"
                value={filterState.keyword}
                onChange={handleChangeKeyword}
                onKeyPress={handleSubmitKeyword}
                sx={{flex: 1, m: "0 20px"}}
                placeholder="Search by keyword"
                onSubmit={e => {
                    e.preventDefault ();
                }}
                color={"info"}
                fullWidth
                InputProps={{
                    startAdornment: <>
                        <InputAdornment position="start">
                            <IconButton onClick={handleApplyKeyword}
                            // type="submit"
                            sx={{pl: 1}}>
                            <SearchIcon color="secondary"/>
                            </IconButton>
                        </InputAdornment>
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
                    </>,
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton onClick={handleClearKeyword}
                                        sx={{p: '10px'}}>
                                <ClearIcon color="secondary"/>
                            </IconButton>
                        </InputAdornment>
                }}
            />
            <Box sx={{maxWidth: 150, flexDirection: "row"}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label="From"
                        inputFormat="MM/dd/yyyy"
                        value={filterState.from}
                        onChange={date => handleChangeDateFrom(date ? date : undefined)}
                        maxDate={filterState.to ? filterState.to : today}
                        renderInput={params =>
                            <TextField
                                {...params}
                            />
                        }
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
                        maxDate={today}
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
                        <ClearIcon color="secondary"/>
                    </IconButton>
                    <div className={[cntrVContent].join(' ')}>
                        <Typography variant="h3">
                            Selected: {state.selection.length}
                        </Typography>
                    </div>
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

        <Card id={historyTable} className="blur">
            <table style={{width: "100%", border: 0}}>
                <tbody>
                {
                    state.filteredData.length ? state.filteredData.map((el, i) => {
                        return <tr id={historyTableRow} key={i}>
                            <td className={historyItem} style={{ width: 40, paddingRight: 5}}>
                                <Checkbox
                                    color="info"
                                    className={historyItem} sx={{width: 40}}
                                    onChange={e => handleCheck(e, i)}
                                    checked={state.selection.includes(i)}
                                />
                            </td>

                            <td className={[h5Font, fontLgrey, historyItem].join(' ')}
                                style={{width: 120}}>
                                {moment(el.createdAt).fromNow()}
                            </td>

                            <td className={[historyItem].join(' ')} style={{width: 20}}>
                                <div className={cntrContent} >
                                    <img alt={"Logo history type item"}
                                         src={
                                             el.type === THistoryMsgType[THistoryMsgType.Notification]
                                                 ? logoHistoryNotification
                                         : el.type ===  THistoryMsgType[THistoryMsgType.Account]
                                                 ? logoHistoryAccount
                                                 : logoHistoryDevice
                                         }
                                    />
                                </div>
                            </td>

                            <td className={[historyItem].join(' ')}>
                                <Typography variant="h3">
                                    {el.text}
                                </Typography>
                            </td>

                            <td className={[floatr, historyItem, cntrVContent].join(' ')}
                                style={{padding: "0 10px"}}>

                                <div style={{display: "flex", flexDirection: "row"}}>
                                    { el.devId && !filterState.filterDevId ?
                                        <Chip
                                            label={`${BOARD_FILTER_HELP_WORD}${el.devId}`}
                                            color="default"
                                            variant={"outlined"}
                                            sx={{opacity: 0.5, m: "0 2px"}}
                                            onClick={() => handleFilterBySelectedItem(i, TFilterCriteria.By_device)}
                                        /> : <></>
                                    }
                                    { el.uId && !filterState.filterUid ?
                                        <Chip
                                            label={`${USER_FILTER_HELP_WORD}${el.uId}`}
                                            color="default"
                                            variant={"outlined"}
                                            sx={{opacity: 0.5, m: "0 2px"}}
                                            onClick={() => handleFilterBySelectedItem(i, TFilterCriteria.By_user)}
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
                            onClick={syncData}
                            startIcon={
                                <img src={logoLoadMore} alt={"Load more entries"}/>
                            }
                    > Load more ({PAGE_ENTRIES_NUM})
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
                onClose={() => handleCloseSettings(true)}
                MenuListProps={{
                    sx: {backgroundColor: "special.main"}
                }}
            >
                <MenuItem key={state.setting.setup[EHistorySetting.delete].name}
                          onClick={handleDeleteByInd}>
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
        </Card>
    </div>
}