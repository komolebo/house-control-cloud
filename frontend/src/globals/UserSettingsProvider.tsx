import {createContext, FC, useState} from "react";
import jwtDecode from "jwt-decode";

const USER_INFO = "USER_INFO"

export interface IUserSetting {
    id: string;
    name: string;
    email: string;
    phone: string;
}


export function setUSerInfo(jwtUserInfo: string) {
    localStorage.setItem(USER_INFO, JSON.stringify(jwtDecode(jwtUserInfo)));
}
export function clearUser() {
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

export const useUserValue = () => {
    const [userSettings, setUserSettings] = useState<IUserSetting>({
        name: "Oleh13",
        email: "dummy_email",
        id: "12345678",
        phone: "+38(096)954-86-76"
    })

    return {
        userSettings,
        setUserSettings
    }
}

export const UserSettingContext = createContext({} as ReturnType<typeof useUserValue>)

export const UserSettingsProvider: FC<any> = (props) => {
    return (
        <UserSettingContext.Provider value={useUserValue()}>
            {props.children}
        </UserSettingContext.Provider>
    )
}
