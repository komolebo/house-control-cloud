import {Table, Column, Model, DataType, ForeignKey, Default, BelongsTo} from 'sequelize-typescript';
import {Users} from "../users/user.entity";
import {THistoryMsgType} from "./dto/history_dto";
import {Devices} from "../devices/device.entity";

@Table({tableName: 'history', updatedAt: false})
export class Histories extends Model<Histories> {
    @Default(THistoryMsgType[THistoryMsgType.None])
    @Column({
        type: DataType.ENUM({values: Object.keys(THistoryMsgType)}),
        allowNull: false,
    })
    type: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    text: string;

    @Column({
        type: DataType.STRING,
    })
    uId?: string;

    @Column({
        type: DataType.STRING,
    })
    devId?: string;

    @BelongsTo(() => Users, { foreignKey: 'userId'})
    user: Users

}