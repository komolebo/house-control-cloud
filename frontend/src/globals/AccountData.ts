export type TUser = {
    full_name: string;
    email: string;
    phone: string;
    login: string;
    blockList: Array<string>;

    phoneVerified: boolean;
    emailVerified: boolean;
}