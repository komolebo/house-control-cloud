import {Table, Column, Model, DataType, BelongsToMany, HasMany, HasOne} from 'sequelize-typescript';
import {Roles} from "../devices/role.entity";
import {Devices} from "../devices/device.entity";
import {Notifications} from "../notification/notification.entity";
import {Histories} from "../history/history.entity"
import {Preference} from "../preference/preference.entity";
import {Blacklist} from "../preference/blacklist.entity";


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

    @HasMany(() => Notifications, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true,
    })
    notifications: Notifications[]

    @HasMany(() => Histories, {
        foreignKey: "userId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    history: Histories[]

    @HasOne(() => Preference, {
        foreignKey: "uId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    preference: Preference
}