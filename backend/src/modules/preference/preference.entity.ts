import {
    BelongsTo,
    Column,
    DataType, HasMany,
    HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {Blacklist} from "./blacklist.entity";
import {Users} from "../users/user.entity";
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
        type: DataType.STRING,
    })
    profile_photo: string;

    @Column({
        type: DataType.STRING,
    })
    profile_photo_id: string;

    @HasMany(() => Blacklist, {
        foreignKey: 'prefId',
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    black_list: Blacklist[]

    @BelongsTo(() => Users, "uId")
    user: Users
}