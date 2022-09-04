import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({tableName: 'releases', updatedAt: false, createdAt: false})
export class Releases extends Model<Releases> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    sys_version: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    bridge: boolean;

    @Column({
        type: DataType.STRING
    })
    socApp: string;

    @Column({
        type: DataType.STRING,
    })
    soc: string;

    @Column({
        type: DataType.STRING,
    })
    hub: string;

    @Column({
        type: DataType.STRING,
    })
    pir: string;

    @Column({
        type: DataType.STRING,
    })
    smoke: string;

    @Column({
        type: DataType.STRING,
    })
    gas: string;

    @Column({
        type: DataType.STRING,
    })
    climate: string;
}