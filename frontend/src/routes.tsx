import {
    ACCOUNT_PAGE,
    SIGNUP_PAGE,
    HISTORY_PAGE,
    HOME_PAGE,
    LOGIN_PAGE,
    FORGOT_PWD_PAGE,
    RESET_PWD_PAGE, ACTIVATE_ACCOUNT_INFO_PAGE, ACTIVATE_ACCOUNT_PAGE
} from "./utils/consts";
import React, {ReactNode} from "react";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import HomePage from "./components/HomePage";
import {HistoryPage} from "./components/HistoryPage";
import {AccountPage} from "./components/AccountPage";
import {CreatePwdPage} from "./components/auth/CreatePasswordPage";
import {ForgotPwdPage} from "./components/auth/ForgotPwdPage";
import {AccountActivationDisplayInfo, ActivateAccountPage} from "./components/auth/AccountActivation";

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
        path: SIGNUP_PAGE,
        Component: <SignupPage/>
    },
    {
        path: FORGOT_PWD_PAGE,
        Component: <ForgotPwdPage/>
    },
    {
        path: RESET_PWD_PAGE,
        Component: <CreatePwdPage/>
    },
    {
        path: ACTIVATE_ACCOUNT_INFO_PAGE,
        Component: <AccountActivationDisplayInfo/>
    },
    {
        path: ACTIVATE_ACCOUNT_PAGE,
        Component: <ActivateAccountPage/>
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