import {createContext, FC, useState} from "react";
import jwtDecode from "jwt-decode";

const USER_INFO = "USER_INFO"
const USER_TOKEN = "USER_TOKEN"

export interface IUserSetting {
    id: number;
    login: string;
    email: string;
    full_name: string;
    phone: string;
}

function setUserInfo(jwtToken: string) {
    localStorage.setItem(USER_INFO, JSON.stringify(jwtDecode(jwtToken)));
}
function setAuthToken(jwtToken: string) {
    localStorage.setItem(USER_TOKEN, jwtToken);
}
function clearUser() {
    localStorage.removeItem(USER_INFO);
    localStorage.removeItem(USER_TOKEN);
}
export function getUserInfo(): IUserSetting | null {
    const uInfoStr = localStorage.getItem(USER_INFO);
    return uInfoStr ? JSON.parse(uInfoStr) : null;
}
export function getAuthToken() {
    return localStorage.getItem(USER_TOKEN);
}
export function isAuth(): boolean {
    return getAuthToken() !== null;
}

export const useUserGlobalInfo = () => {
    const [authorized, setAuthorized] = useState(isAuth());
    const [avatarSrc, setAvatarSrc] = useState<string>("")

    const setAuthData = (jwtToken: string) => {
        setUserInfo(jwtToken);
        setAuthToken(jwtToken);
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

        avatarSrc,
        setAvatarSrc
    }
}

export const UserAuthContext = createContext({} as ReturnType<typeof useUserGlobalInfo>)

export const UserAuthProvider: FC<any> = (props) => {
    return (
        <UserAuthContext.Provider value={useUserGlobalInfo()}>
            {props.children}
        </UserAuthContext.Provider>
    )
}
