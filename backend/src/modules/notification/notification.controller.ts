import {Controller, Delete, Get, Param, UseGuards} from '@nestjs/common';
import {NotificationService} from "./notification.service";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";

@Controller('api/notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @UseGuards(UserIsUserGuard)
    @Get(`list/:${ENDPOINT_PARAM_USER_ID}`)
    async getNotificationsPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.notificationService.getNotificationsByUser(userId);
    }

    @UseGuards(UserIsUserGuard)
    @Get(`exist/:${ENDPOINT_PARAM_USER_ID}`)
    async isNotificationsPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.notificationService.isNotificationsByUser(userId);
    }

    @UseGuards(UserIsUserGuard)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}/:notif_id`)
    async deleteNotificationById(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                                 @Param('notif_id') notificationId: number) {
        return await this.notificationService.removeNotificationFromUser(userId, notificationId)
    }
}
