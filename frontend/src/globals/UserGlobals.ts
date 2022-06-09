import {createContext} from "react";


export type UserSetting = {
    isAuth: boolean,
    setIsAuth:(auth: boolean) => void
}

export const UserSettingContext = createContext<UserSetting>({
    isAuth: false,
    setIsAuth: () => {},
})
