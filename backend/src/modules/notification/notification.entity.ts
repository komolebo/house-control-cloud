import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    PrimaryKey,
    BelongsToMany,
    BelongsTo,
    HasOne
} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {ENotificationSeverity, MsgTypes} from "./messages/msgTypes";
import {Devices} from "../devices/device.entity";
import {Routines} from "./routine.entity";

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

    @Column({
        type: DataType.INTEGER,
    })
    objUserId: number;

    @Column({
        type: DataType.ENUM({values: Object.keys(MsgTypes)}),
        allowNull: false
    })
    msgType: string;

    @Column({
        type: DataType.ENUM({values: Object.keys(ENotificationSeverity)}),
        allowNull: false,
    })
    severity: string;

    @Column({
        type: DataType.STRING
    })
    text: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    userNotificationFkId: number;

    @BelongsTo(() => Users, "userNotificationFkId")
    user: Users

    @BelongsTo(() => Routines, "routineId")
    routine: Routines
}