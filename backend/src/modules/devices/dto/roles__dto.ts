export enum RoleValues {
    Owner = "OWNER",
    Guest = "QUEST",
    Child = "CHILD",

    None = "NONE",

    Default = Guest
}

export class BindDevice_Dto {
    readonly role: RoleValues;
}