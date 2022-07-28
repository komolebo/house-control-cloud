import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersService } from './users.service';
import {usersProviders} from "./users.providers";
import { UsersController } from './users.controller';
import {Roles} from "../devices/role.entity";
import {Devices} from "../devices/device.entity";
import {Users} from "./user.entity";
import {DatabaseModule} from "../../core/database/database.module";
import {Preference} from "../preference/preference.entity";
import {Blacklist} from "../preference/blacklist.entity";
import {AuthModule} from "../auth/auth.module";
import {PreferenceModule} from "../preference/preference.module";
import {DevicesService} from "../devices/devices.service";
import {DevicesModule} from "../devices/devices.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  imports: [
      DevicesModule,
      PreferenceModule,
      DatabaseModule,
      AuthModule,
      SequelizeModule.forFeature([Devices, Users, Roles, Preference, Blacklist]),
  ]
})
export class UsersModule {}
