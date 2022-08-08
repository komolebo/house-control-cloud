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
}
export interface IUserModifySetting {
    email?: string;
    full_name?: string;
    phone?: string;
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
            console.log("useUserGlobalInfo")
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
        if (userInfo) {
            uNewInfo.full_name && (userInfo.full_name = uNewInfo.full_name)
            uNewInfo.email && (userInfo.email = uNewInfo.email)
            uNewInfo.phone && (userInfo.phone = uNewInfo.phone)
            setUserInfo({...userInfo})
        }
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
