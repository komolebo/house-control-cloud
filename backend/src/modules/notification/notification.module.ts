import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [SequelizeModule.forFeature([Notifications])]
})
export class NotificationModule {}
