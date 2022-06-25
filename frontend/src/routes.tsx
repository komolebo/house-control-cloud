import {AUTH_PAGE, HOME_PAGE, LOGIN_PAGE} from "./utils/consts";
import React, {ReactNode} from "react";
import LoginPage from "./components/LoginPage";
import AuthPage from "./components/AuthPage";
import HomePage from "./components/HomePage";

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
        Component: <AuthPage/>
    },
    {
        path: HOME_PAGE,
        Component: <HomePage/>
    }
]

export const privateRoutes: ITableRoute[] = [
    {
        path: LOGIN_PAGE,
        Component: <LoginPage/>
    },
]