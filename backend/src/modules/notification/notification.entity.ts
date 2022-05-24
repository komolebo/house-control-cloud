import {Table, Column, Model, DataType, ForeignKey, PrimaryKey} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {NotificationTypes} from "./messages/notification.types";
import {Devices} from "../devices/device.entity";

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
        type: DataType.ENUM({values: Object.keys(NotificationTypes)}),
        allowNull: false
    })
    msgType: string
}