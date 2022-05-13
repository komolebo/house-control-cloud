import {Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import {User} from "../users/user.entity";
import {Device} from "./device.entity";

@Table
export class Role extends Model<Role> {
    @Column({
        type: DataType.ENUM('OWNER', 'CHILD', 'GUEST'),
        allowNull: false,
        defaultValue: "GUEST"
    })
    role: string;

    // @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;

    // @ForeignKey(() => Device)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    device_id: number;
}