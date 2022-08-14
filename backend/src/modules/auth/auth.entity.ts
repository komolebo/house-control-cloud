import {BelongsTo, BelongsToMany, Column, DataType, HasOne, Model, Sequelize, Table} from "sequelize-typescript";
import {Users} from "../users/user.entity";
import {Devices} from "../devices/device.entity";
import {Roles} from "../devices/role.entity";

@Table({tableName: 'auth'})
export class Auth extends Model<Auth> {
    @Column({
        type: DataType.TEXT
    })
    reset_token: string;

    @Column({
        type: DataType.DATE,
    })
    reset_token_expire: string;

    // @HasOne(() => Users)
    // user: Users

    @BelongsTo(() => Users, "userAuthId")
    user: Users
}