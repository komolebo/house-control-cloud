import {BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript";
import {Users} from "../users/user.entity";

@Table({tableName: 'auth'})
export class Auth extends Model<Auth> {
    @Column({
        type: DataType.TEXT
    })
    token: string;

    @Column({
        type: DataType.DATE,
    })
    token_expire: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    activated: boolean;

    // @HasOne(() => Users)
    // user: Users

    @BelongsTo(() => Users, "userAuthId")
    user: Users
}