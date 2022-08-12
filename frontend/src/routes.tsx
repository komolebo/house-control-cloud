import {
    ACCOUNT_PAGE,
    AUTH_PAGE,
    HISTORY_PAGE,
    HOME_PAGE,
    LOGIN_PAGE,
    FORGOT_PWD_PAGE,
    RESET_PWD_PAGE
} from "./utils/consts";
import React, {ReactNode} from "react";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import HomePage from "./components/HomePage";
import {HistoryPage} from "./components/HistoryPage";
import {AccountPage} from "./components/AccountPage";
import {CreatePwdPage} from "./components/auth/CreatePasswordPage";
import {ForgotPwdPage} from "./components/auth/ForgotPwdPage";

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
    {
        path: FORGOT_PWD_PAGE,
        Component: <ForgotPwdPage/>
        // Component: <CreatePwdPage/>
        // Component: <CheckYourEmailPage/>
    },
    {
        path: RESET_PWD_PAGE,
        Component: <CreatePwdPage/>
    }
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