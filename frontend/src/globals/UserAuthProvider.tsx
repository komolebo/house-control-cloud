import {createContext, FC, useEffect, useState} from "react";
import {nestGetUserFullInfo} from "../http/rqData";
import {updateTokenInHostHeaders} from "../http";
import {
    clearUserFromStore,
    initUserInfoFromStore,
    isAuth,
    IUserModifySetting,
    IUserSetting,
    setAuthTokenToStore
} from "./storage";

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
