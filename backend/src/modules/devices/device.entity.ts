import {Table, Column, Model, DataType, BelongsToMany} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {Roles} from "./role.entity";


@Table({tableName: 'devices'})
export class Devices extends Model<Devices> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    ip: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    hex: string;

    @Column({
        type: DataType.DATE,
    })
    last_connected: string;

    @Column({
        type: DataType.BOOLEAN
    })
    active: boolean;

    @Column({
        type: DataType.STRING
    })
    version: string;

    @BelongsToMany(() => Users, () => Roles)
    users: Users[]
}