import {Table, Column, Model, DataType, BelongsToMany, HasMany} from 'sequelize-typescript';
import {Roles} from "../devices/role.entity";
import {Devices} from "../devices/device.entity";
import {Notifications} from "../notification/notification.entity";
import {Histories} from "../history/history.entity"


@Table({tableName: 'users'})
export class Users extends Model<Users> {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name: string;

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

    @HasMany(() => Histories, { foreignKey: 'userId'})
    history: Histories[]
}