import {Table, Column, Model, DataType, BelongsToMany} from 'sequelize-typescript';
import {User} from "../users/user.entity";
import {Role} from "./role.entity";


@Table
export class Device extends Model<Device> {
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

    // @BelongsToMany(() => User, () => Role)
    // users: User[]
}