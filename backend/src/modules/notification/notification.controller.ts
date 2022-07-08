import {Controller, Delete, Get, Headers, Param, Post} from '@nestjs/common';
import {NotificationService} from "./notification.service";
import {Users} from "../users/user.entity";

@Controller('api/notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get("list/:user_id")
    async getNotificationsPerUser(@Param('user_id') user_id: number) {
        return await this.notificationService.getNotificationsByUser(user_id);
    }

    @Get("exist/:user_id")
    async isNotificationsPerUser(@Param('user_id') user_id: number) {
        return await this.notificationService.isNotificationsByUser(user_id);
    }

    // @Post("trigger/:notif_id/:action")
    // async triggerNotification(@Param('notif_id') notif_id: number,
    //                           @Param('action') msgType: string) {
    //     return await this.notificationService.createNotification(null)
    // }

    @Delete(":notif_id")
    async deleteNotificationById(@Headers() headers,
                                 @Param('notif_id') notif_id: number) {
        const [, userInfo] = headers.authorization.split("Bearer ")
        const thisUser: Users  = JSON.parse(userInfo);
        return await this.notificationService.removeNotificationFromUser(notif_id, thisUser.id)
    }
}
