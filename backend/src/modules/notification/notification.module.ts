import {forwardRef, Module} from '@nestjs/common';
import { NotificationFunctionService } from './notification-function.service';
import { NotificationController } from './notification.controller';
import {NotificationService} from "./notification-wrapper.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Routines} from "./routine.entity";
import {SocketModule} from "../../sockets/socket.module";
import {HistoryModule} from "../history/history.module";
import {DatabaseModule} from "../../core/database/database.module";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {Users} from "../users/user.entity";
import {Roles} from "../devices/role.entity";
import {Notifications} from "./notification.entity";
import {RoutineService} from "./routine.service";
import {Devices} from "../devices/device.entity";
import {DevicesModule} from "../devices/devices.module";
import {PreferenceModule} from "../preference/preference.module";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, RoutineService, NotificationFunctionService],
  exports: [NotificationService, RoutineService],
  imports: [
      forwardRef(() => UsersModule),
      forwardRef(() => AuthModule),
      forwardRef(() => DevicesModule),
      DatabaseModule,
      SequelizeModule.forFeature([Notifications, Users, Devices, Roles, Routines]),
      SocketModule,
      HistoryModule,
      PreferenceModule
  ]
})
export class NotificationModule {}
