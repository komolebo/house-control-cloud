import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersService } from './users.service';
import {usersProviders} from "./users.providers";
import { UsersController } from './users.controller';
import {Roles} from "../devices/role.entity";
import {Devices} from "../devices/device.entity";
import {Users} from "./user.entity";
import {DatabaseModule} from "../../core/database/database.module";

@Module({
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [
      DatabaseModule,
      SequelizeModule.forFeature([Devices, Users, Roles])
  ]
})
export class UsersModule {}
