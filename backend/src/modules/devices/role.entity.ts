import {Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {Devices} from "./device.entity";

@Table({tableName: 'roles'})
export class Roles extends Model<Roles> {
    @Column({
        type: DataType.ENUM('OWNER', 'CHILD', 'GUEST'),
        allowNull: false,
        defaultValue: "GUEST"
    })
    role: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @ForeignKey(() => Devices)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    deviceId: number;
}