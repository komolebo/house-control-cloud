import jwtDecode from "jwt-decode";

const DARK_MODE_TOKEN = "DARK_MODE_TOKEN"
const USER_TOKEN = "USER_TOKEN"
const IS_DARK_MODE_DEFAULT = false;

export interface IUserSetting {
    id: number;
    login: string;
    email: string;
    full_name: string;
    phone: string;
    preference: IUserPreference;
}
export interface IUserPreference {
    email_verified: boolean;
    phone_verified: boolean;
    profile_photo: string;
}
export interface IUserModifySetting {
    email?: string;
    full_name?: string;
    phone?: string;
}

// dark mode public handlers
export function setDarkModeToStorage(isDark: boolean) {
    localStorage.setItem (DARK_MODE_TOKEN, JSON.stringify (isDark))
}
export function getDarkModeFromStorage(): boolean {
    const item = localStorage.getItem (DARK_MODE_TOKEN)
    return item ? JSON.parse (item) : IS_DARK_MODE_DEFAULT
}


// user info public handlers
export function setAuthTokenToStore(jwtToken: string) {
    localStorage.setItem (USER_TOKEN, jwtToken);
}
export function clearUserFromStore() {
    localStorage.removeItem (USER_TOKEN);
}
export function getAuthToken() {
    return localStorage.getItem (USER_TOKEN);
}
export function isAuthTokenSaved(): boolean {
    return getAuthToken () !== null;
}
export const initUserInfoFromStore = () => {
    const token = getAuthToken ()

    try {
        if (token) {
            return jwtDecode<IUserSetting>(token)
        }
        return null;
    } catch (e) {
        return null
    }
}