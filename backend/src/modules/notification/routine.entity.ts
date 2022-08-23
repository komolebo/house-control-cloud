import {Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Notifications} from "./notification.entity";
import {ERoutineType} from "./dto/routineTypes";
import {Users} from "../users/user.entity";
import {Devices} from "../devices/device.entity";

@Table({tableName: 'routines', updatedAt: false})
export class Routines extends Model<Routines> {
    @Column({
        type: DataType.ENUM({values: Object.keys(ERoutineType)}),
        allowNull: false,
    })
    type: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
    })
    objUserId: number;

    @ForeignKey(() => Devices)
    @Column({
        type: DataType.INTEGER,
    })
    objDeviceId: number;

    @HasMany(() => Notifications, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true,
        foreignKey: "routineId"
    })
    notifications: Notifications[]
}