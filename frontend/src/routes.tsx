import {AUTH_PAGE, LOGIN_PAGE} from "./utils/consts";
import React, {ReactNode} from "react";
import LoginPage from "./components/LoginPage";
import AuthPage from "./components/AuthPage";

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
    }
]