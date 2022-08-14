import {createContext, FC, useState} from "react";
import {getDarkModeFromStorage, setDarkModeToStorage} from "../storage";


export const useDarkModeSetting = () => {
    const [dark, setDark] = useState<boolean>(getDarkModeFromStorage());

    const setGlobalDark = (dark: boolean) => {
        setDarkModeToStorage(dark);
        setDark(dark);
    }

    return {
        globalDark: dark,
        setGlobalDark: setGlobalDark
    }
}

export const DarkModeContext = createContext({} as ReturnType<typeof useDarkModeSetting>)

export const DarkModeProvider: FC<any> = (props) => {
    return (
        <DarkModeContext.Provider value={useDarkModeSetting()}>
            {props.children}
        </DarkModeContext.Provider>
    )
}