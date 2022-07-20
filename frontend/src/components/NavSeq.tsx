import React, {FC} from "react";
import {ACCOUNT_PAGE, HISTORY_PAGE, HOME_PAGE} from "../utils/consts";
import {IconButton} from "@mui/material";
import logoBackToHome from "../assets/arrow-right.svg";
import {h5Font, helpText} from "../styles/common/fonts.css";
import {useNavigate} from "react-router-dom";
import {cntrVContent} from "../styles/common/position.css";

interface IProp {
    currentPage: string;
}
type TPathEl = {
    name: string;
    path: string;
}

export const NavSeq: FC<IProp> = ({currentPage}) => {

    const getPathElements = (curPage: string): Array<TPathEl> => {
        switch (curPage) {
            case HISTORY_PAGE:
                return [
                    {name: "History", path: HISTORY_PAGE},
                ]
            case ACCOUNT_PAGE:
                return [
                    {name: "Account", path: ACCOUNT_PAGE},
                ]
            default:
                return []
        }
    }
    const pathElements = getPathElements(currentPage);
    const navigate = useNavigate();

    return <div style={{display: "flex", flexDirection: "row"}}>
        <IconButton color="inherit" onClick={() => navigate(HOME_PAGE)}>
            <div className={h5Font}>
                Home
            </div>
        </IconButton>

        {
            pathElements.map((pathEl, i) => {
                return <div className={cntrVContent} key={i}>
                    <img src={logoBackToHome} alt={"Back to home"} />

                    <IconButton onClick={() => i < pathElements.length - 1 && navigate(pathEl.path)}
                                // disabled={i === pathElements.length - 1} // disable last element
                    >
                        <div className={i === pathElements.length - 1 ? helpText : h5Font}>
                            {pathEl.name}
                        </div>
                    </IconButton>
                </div>
            })
        }

    </div>
}