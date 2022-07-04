import {createContext, FC, useState} from "react";
import jwtDecode from "jwt-decode";

const USER_INFO = "USER_INFO"

export interface IUserSetting {
    id: string;
    name: string;
    email: string;
    phone: string;
}


function setUserInfo(jwtUserInfo: string) {
    localStorage.setItem(USER_INFO, JSON.stringify(jwtDecode(jwtUserInfo)));
}
function clearUser() {
    localStorage.removeItem(USER_INFO);
}
export function getUserInfo(): IUserSetting | null {
    const uInfoStr = localStorage.getItem(USER_INFO);
    return uInfoStr ? JSON.parse(uInfoStr) : null;
}
export function getAuthToken() {
    return localStorage.getItem(USER_INFO);
}
export function isAuth(): boolean {
    return getAuthToken() !== null;
}

export const useAuth = () => {
    const [authorized, setAuthorized] = useState(isAuth());

    const setAuthData = (jwtUserInfo: string) => {
        setUserInfo(jwtUserInfo);
        setAuthorized(isAuth());
    }
    const clearUserData = () => {
        clearUser();
        setAuthorized(isAuth);
    }

    return {
        authorized,
        setAuthData,
        clearUserData,
    }
}

export const UserAuthContext = createContext({} as ReturnType<typeof useAuth>)

export const UserAuthProvider: FC<any> = (props) => {
    return (
        <UserAuthContext.Provider value={useAuth()}>
            {props.children}
        </UserAuthContext.Provider>
    )
}
