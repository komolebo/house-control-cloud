import React, {FC} from "react";
import {ACCOUNT_PAGE, HISTORY_PAGE, HOME_PAGE} from "../utils/consts";
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface IProp {
    currentPage: string;
}
type TPathEl = {
    name: string;
    path: string;
}

export const NavSeq: FC<IProp> = ({currentPage}) => {
    const navigate = useNavigate();

    const getPathElements = (curPage: string): Array<TPathEl> => {
        switch (curPage) {
            case HISTORY_PAGE:
                return [
                    {name: "Home", path: HOME_PAGE},
                    {name: "History", path: HISTORY_PAGE},
                ]
            case ACCOUNT_PAGE:
                return [
                    {name: "Home", path: HOME_PAGE},
                    {name: "Account", path: ACCOUNT_PAGE},
                ]
            default:
                return []
        }
    }
    const pathElements = getPathElements(currentPage);

    const breadCrumbs = pathElements.map((el, i) =>
        i < pathElements.length - 1
        ? <Link
            underline="hover"
            key={i}
            color="text.primary"
            onClick={() => navigate(el.path)}
        >
            {el.name}
        </Link>
        : <Typography
                key={i}
                color="secondary"
            >
                {el.name}
        </Typography>,
    )

    return <div style={{display: "flex", flexDirection: "row"}}>
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" color={"secondary"} />}
            aria-label="breadcrumb"
        >
            {breadCrumbs}
        </Breadcrumbs>
    </div>
}