import {ACCOUNT_PAGE, AUTH_PAGE, HISTORY_PAGE, HOME_PAGE, LOGIN_PAGE} from "./utils/consts";
import React, {ReactNode} from "react";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import HomePage from "./components/HomePage";
import {HistoryPage} from "./components/HistoryPage";
import {AccountPage} from "./components/AccountPage";

interface ITableRoute {
    path: string;
    Component: ReactNode
}

export const publicRoutes: ITableRoute[] = [
    {
        path: LOGIN_PAGE,
        Component: <LoginPage/>
    },
    {
        path: AUTH_PAGE,
        Component: <SignupPage/>
    },
]

export const privateRoutes: ITableRoute[] = [
    {
        path: HOME_PAGE,
        Component: <HomePage/>
    },
    {
        path: HISTORY_PAGE,
        Component: <HistoryPage/>
    },
    {
        path: ACCOUNT_PAGE,
        Component: <AccountPage/>
    }
]