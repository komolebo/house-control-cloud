import { Module } from '@nestjs/common';
import { databaseProviders} from "./database.providers";
import {SequelizeModule} from "@nestjs/sequelize";
import {Devices} from "../../modules/devices/device.entity";
import {Roles} from "../../modules/devices/role.entity";
import {Users} from "../../modules/users/user.entity";

@Module({
    imports: [SequelizeModule.forFeature([Devices, Users, Roles])],
    providers: [...databaseProviders],
    exports: [...databaseProviders]
})
export class DatabaseModule {}
