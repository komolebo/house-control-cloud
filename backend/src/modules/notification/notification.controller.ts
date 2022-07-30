import {Controller, Delete, Get, Param, UseGuards} from '@nestjs/common';
import {NotificationService} from "./notification.service";
import {ENDPOINT_PARAM_USER_ID, UserIsUser} from "../../core/guards/UserIsUser";

@Controller('api/notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @UseGuards(UserIsUser)
    @Get(`list/:${ENDPOINT_PARAM_USER_ID}`)
    async getNotificationsPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.notificationService.getNotificationsByUser(userId);
    }

    @UseGuards(UserIsUser)
    @Get(`exist/:${ENDPOINT_PARAM_USER_ID}`)
    async isNotificationsPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.notificationService.isNotificationsByUser(userId);
    }

    @UseGuards(UserIsUser)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}/:notif_id`)
    async deleteNotificationById(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                                 @Param('notif_id') notificationId: number) {
        return await this.notificationService.removeNotificationFromUser(userId, notificationId)
    }
}
