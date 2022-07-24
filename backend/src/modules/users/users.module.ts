import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersService } from './users.service';
import {usersProviders} from "./users.providers";
import { UsersController } from './users.controller';
import {Roles} from "../devices/role.entity";
import {Devices} from "../devices/device.entity";
import {Users} from "./user.entity";
import {DatabaseModule} from "../../core/database/database.module";
import {Preference} from "./preference.entity";
import {Blacklist} from "./blacklist.entity";
import {PreferenceService} from "./preference.service";
import {PreferenceController} from "./preference.controller";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [UsersService, PreferenceService, ...usersProviders],
  controllers: [UsersController, PreferenceController],
  exports: [UsersService, PreferenceService],
  imports: [
      DatabaseModule,
      AuthModule,
      SequelizeModule.forFeature([Devices, Users, Roles, Preference, Blacklist])
  ]
})
export class UsersModule {}
