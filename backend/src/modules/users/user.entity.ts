import {Table, Column, Model, DataType, BelongsToMany} from 'sequelize-typescript';
import {Role} from "../devices/role.entity";
import {Device} from "../devices/device.entity";


@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
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

    // @BelongsToMany(() => Device, () => Role)
    // users: User[]
}