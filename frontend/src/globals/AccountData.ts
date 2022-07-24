export type TUser = {
    full_name: string;
    email: string;
    phone: string;
    login: string;

    prefs: TUPref
    blockList: Array<TBlItem>;
}

export type TUPref = {
    phone_verified: boolean;
    email_verified: boolean;
    dark_mode: boolean;
    profile_photo: string;
    id: number;
}

export type TBlItem = {
    name: string;
    login: string;
    id: number;
}

