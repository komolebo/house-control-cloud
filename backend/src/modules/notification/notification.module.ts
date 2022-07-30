import {forwardRef, Module} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {DatabaseModule} from "../../core/database/database.module";
import {Users} from "../users/user.entity";
import {SocketModule} from "../../sockets/socket.module";
import {AuthModule} from "../auth/auth.module";
import {HistoryModule} from "../history/history.module";
import {UsersModule} from "../users/users.module";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [
      forwardRef(() => UsersModule),
      forwardRef(() => AuthModule),
      DatabaseModule,
      SequelizeModule.forFeature([Notifications, Users]),
      SocketModule,
      HistoryModule,
  ]
})
export class NotificationModule {}
