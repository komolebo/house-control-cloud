import {Table, Column, Model, DataType, ForeignKey, PrimaryKey, BelongsToMany, BelongsTo} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {ENotificationSeverity, ENotificationTypes} from "./messages/ENotificationTypes";
import {Devices} from "../devices/device.entity";
import {Roles} from "../devices/role.entity";

@Table({tableName: 'notifications'})
export class Notifications extends Model<Notifications> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Devices)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    deviceId: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    sourceUserId: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    targetUserId: number;

    @Column({
        type: DataType.ENUM({values: Object.keys(ENotificationTypes)}),
        allowNull: false
    })
    msgType: string

    @Column({
        type: DataType.ENUM({values: Object.keys(ENotificationSeverity)}),
        allowNull: false,
    })
    severity: ENotificationSeverity;

    @BelongsTo(() => Users)
    user: Users
}