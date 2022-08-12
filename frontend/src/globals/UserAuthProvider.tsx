import {createContext, FC, useEffect, useState} from "react";
import {nestGetUserFullInfo} from "../http/rqData";
import {updateTokenInHostHeaders} from "../http";
import jwtDecode from "jwt-decode";

const USER_TOKEN = "USER_TOKEN"

export interface IUserSetting {
    id: number;
    login: string;
    email: string;
    full_name: string;
    phone: string;
    preference: IUserPreference;
}
export interface IUserPreference {
    dark_mode: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    profile_photo: string;
}
export interface IUserModifySetting {
    email?: string;
    full_name?: string;
    phone?: string;
    dark_mode?: boolean;
}

function setAuthTokenToStore(jwtToken: string) {
    localStorage.setItem(USER_TOKEN, jwtToken);
}
function clearUserFromStore() {
    localStorage.removeItem(USER_TOKEN);
}
export function getAuthToken() {
    return localStorage.getItem(USER_TOKEN);
}
export function isAuth(): boolean {
    return getAuthToken() !== null;
}
const initUserInfoFromStore = () => {
    const token = getAuthToken()
    const user: IUserSetting | null = token ? jwtDecode(token) : null
    return user ? user : null
}

export const useUserGlobalInfo = () => {
    const [authorized, setAuthorized] = useState(isAuth());
    const [avatarSrc, setAvatarSrc] = useState<string>("")
    const [userInfo, setUserInfo] = useState<IUserSetting | null>(
        authorized ? initUserInfoFromStore() : null
    )

    useEffect(() => {
        if (authorized) {
            const userStorageData = initUserInfoFromStore()
            userStorageData && nestGetUserFullInfo(userStorageData.id).then(resp => {
                if (resp.status === 200 || resp.status === 201) {
                    setUserInfo(resp.data)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorized])

    const setAuthData = (jwtToken: string) => {
        setAuthTokenToStore(jwtToken);
        updateTokenInHostHeaders()
        setAuthorized(isAuth());
    }
    const clearUserData = () => {
        clearUserFromStore();
        setAuthorized(isAuth);
    }
    const updateUserInfo = (uNewInfo: IUserModifySetting) => {
        if (!userInfo) return;

        if(uNewInfo.full_name !== undefined)
            userInfo.full_name = uNewInfo.full_name;

        if(uNewInfo.email !== undefined)
            userInfo.email = uNewInfo.email;

        if(uNewInfo.phone !== undefined)
            userInfo.phone = uNewInfo.phone;

        if (uNewInfo.dark_mode !== undefined)
            userInfo.preference.dark_mode = uNewInfo.dark_mode;

        setUserInfo({...userInfo})
    }

    return {
        authorized,
        setAuthData,

        userInfo,
        updateUserInfo,
        clearUserData,

        avatarSrc,
        setAvatarSrc
    }
}

export const UserGlobalContext = createContext({} as ReturnType<typeof useUserGlobalInfo>)

export const UserAuthProvider: FC<any> = (props) => {
    return (
        <UserGlobalContext.Provider value={useUserGlobalInfo()}>
            {props.children}
        </UserGlobalContext.Provider>
    )
}
