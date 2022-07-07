export enum RoleValues {
    Owner = "OWNER",
    Guest = "GUEST",
    Child = "CHILD",
    None = "NONE",

    Default = Guest
}

export class BindDevice_Dto {
    readonly role: RoleValues;
}

type RoleValue = RoleValues.Owner | RoleValues.Guest | RoleValues.Child;