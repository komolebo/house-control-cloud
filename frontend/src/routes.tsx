import {LOGIN_PAGE} from "./utils/consts";
import React, {ReactNode} from "react";
import LoginPage from "./components/LoginPage";

interface ITableRoute {
    path: string;
    Component: ReactNode
}

export const publicRoutes: ITableRoute[] = [
    {
        path: LOGIN_PAGE,
        Component: <LoginPage/>
    }
]