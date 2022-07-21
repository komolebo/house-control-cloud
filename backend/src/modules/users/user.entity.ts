import {Table, Column, Model, DataType, BelongsToMany, HasMany, HasOne} from 'sequelize-typescript';
import {Roles} from "../devices/role.entity";
import {Devices} from "../devices/device.entity";
import {Notifications} from "../notification/notification.entity";
import {Histories} from "../history/history.entity"
import {Preference} from "./preference.entity";
import {Blacklist} from "./blacklist.entity";


@Table({tableName: 'users'})
export class Users extends Model<Users> {
    @Column({
        type: DataType.STRING,
    })
    full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    login: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    phone: string;

    @BelongsToMany(() => Devices, () => Roles)
    devices: Devices[]

    @HasMany(() => Notifications)
    notifications: Notifications[]

    @HasMany(() => Histories, 'userId')
    history: Histories[]

    @HasOne(() => Preference, "prefId")
    preference: Preference
}