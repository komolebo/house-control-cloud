import {Module} from "@nestjs/common";
import { DevicesService } from './devices.service';
import {DevicesController} from "./devices.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Devices} from "./device.entity";
import {Roles} from "./role.entity";
import {Users} from "../users/user.entity";
import {DatabaseModule} from "../../core/database/database.module";

@Module({
  providers: [DevicesService],
  exports: [DevicesModule],
  controllers: [DevicesController],
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([Devices, Users, Roles])
  ]
})

export class DevicesModule {}
