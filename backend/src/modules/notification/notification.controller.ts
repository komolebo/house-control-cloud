import {Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {NotificationFunctionService} from "./notification-function.service";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";
import {RoutineService} from "./routine.service";
import {NotificationCmd} from "./messages/msgTypes";
import {NotificationService} from "./notification-wrapper.service";

@Controller('api/')
export class NotificationController {
    constructor(private notificationService: NotificationService,
                private routineService: RoutineService) {}

    @UseGuards(UserIsUserGuard)
    @Get(`notification/list/:${ENDPOINT_PARAM_USER_ID}`)
    async getNotificationsPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.notificationService.getNotificationsByUser(userId);
    }

    @UseGuards(UserIsUserGuard)
    @Get(`notification/count/:${ENDPOINT_PARAM_USER_ID}`)
    async countNotificationsPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.notificationService.countNotificationsByUser(userId);
    }

    @UseGuards(UserIsUserGuard)
    @Delete(`notification/:${ENDPOINT_PARAM_USER_ID}/:notif_id`)
    async deleteNotificationById(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                                 @Param('notif_id') notificationId: number) {
        return await this.notificationService.handleRqRemoveNotification(userId, notificationId)
    }

    @UseGuards(UserIsUserGuard)
    @Post(`routine/:${ENDPOINT_PARAM_USER_ID}/:notif_id/:cmd`)
    async postRoutineAction(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                            @Param('notif_id') notifId: number,
                            @Param('cmd') cmd: NotificationCmd) {
        return await this.routineService.processRoutineAction(notifId, cmd);
    }
}
