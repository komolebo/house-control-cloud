import {
    BelongsTo,
    Column,
    DataType, HasMany,
    HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {Blacklist} from "./blacklist.entity";
import {Users} from "./user.entity";
import {Histories} from "../history/history.entity";

@Table({tableName: 'preferences', updatedAt: false})
export class Preference extends Model<Preference> {
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    phone_verified: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    email_verified: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    dark_mode: boolean;

    @HasMany(() => Blacklist, 'prefId')
    black_list: Blacklist[]

    @BelongsTo(() => Users, "prefIf")
    user: Users
}