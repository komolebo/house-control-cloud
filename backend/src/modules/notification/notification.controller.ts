import {Controller, Get, Param, Post} from '@nestjs/common';
import {NotificationService} from "./notification.service";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get("list/:user_id")
    async getNotificationsPerUser(@Param('user_id') user_id: number) {

    }

    @Post("trigger/:notif_id/:action")
    async triggerNotification(@Param('notif_id') notif_id: number,
                              @Param('action') action: string) {

    }
}
