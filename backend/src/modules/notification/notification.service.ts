import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {CreateNotification_Dto} from "./dto/create_notification__dto";

@Injectable()
export class NotificationService {
    constructor(@InjectModel(Notifications) private readonly notificationRepository: typeof Notifications) {}

    async create(notification: CreateNotification_Dto) {
        return await this.notificationRepository.create<Notifications>(notification);
    }

    async remove(notificationId: number) {
        return await this.notificationRepository.destroy({where: {id: notificationId}});
    }

    async getNotificationsByUser(userId: number) {
        return await this.notificationRepository.findOne({where: {targetUserId: userId}});
    }

    async sendNotificationToFront(notification: CreateNotification_Dto) {

    }
}
