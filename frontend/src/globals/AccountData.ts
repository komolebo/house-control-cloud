export type TUser = {
    id: number,
    full_name: string;
    email: string;
    phone: string;
    login: string;

    preference: TUPref
}

export type TUPref = {
    black_list?: Array<TBlItem>;

    phone_verified?: boolean;
    email_verified?: boolean;
    dark_mode?: boolean;
    profile_photo?: string;
    id?: number;
}

export type TBlItem = {
    name: string;
    login: string;
    id: number;
    urlPic: string;
}

