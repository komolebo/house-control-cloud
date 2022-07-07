import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {DatabaseModule} from "../../core/database/database.module";

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [
      DatabaseModule,
      SequelizeModule.forFeature([Notifications]),
  ]
})
export class NotificationModule {}
