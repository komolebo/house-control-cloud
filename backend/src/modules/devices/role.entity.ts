import {Table, Column, Model, DataType, ForeignKey, Default} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {Devices} from "./device.entity";
import {RoleValues} from "./dto/roles__dto";

@Table({tableName: 'roles'})
export class Roles extends Model<Roles> {
    @Default(RoleValues.Default)
    @Column({
        type: DataType.ENUM({values: Object.keys(RoleValues)}),
        allowNull: false,
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