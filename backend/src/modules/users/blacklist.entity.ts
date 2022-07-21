import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Users} from "./user.entity";
import {Preference} from "./preference.entity";

@Table({tableName: "blacklist"})
export class Blacklist extends Model<Blacklist> {
    @ForeignKey(() => Preference)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    prefId: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    blockUserId: number;

    @BelongsTo(() => Preference, { foreignKey: 'prefId'})
    preference: Preference
}