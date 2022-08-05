import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {CreateNotification_Dto} from "./dto/create_notification__dto";
import {Users} from "../users/user.entity";
import {ENotificationSeverity, ENotificationTypes, ExplainNotificationMap} from "./messages/ENotificationTypes";
import {SocketService} from "../../sockets/socket.service";
import {HistoryService} from "../history/history.service";
import {THistoryMsgType} from "../history/dto/history_dto";
import {Histories} from "../history/history.entity";


function notificationInterpretData(notification: Notifications) {
    const notifyObj = notification["dataValues"];
    const explainInfo = ExplainNotificationMap(notifyObj.msgType, notifyObj);
    if (explainInfo) {
        notifyObj["actions"] = explainInfo.actions;
        // notifyObj.createdAt = moment(notifyObj.createdAt).fromNow();
    }
}

@Injectable()
export class NotificationService {
    constructor(@InjectModel(Notifications) private readonly notificationRepository: typeof Notifications,
                @InjectModel(Users) private readonly userRepository: typeof Users,
                private readonly historyService: HistoryService,
                private readonly socketService: SocketService) {}

    async remove(notificationId: number) {
        return await this.notificationRepository.destroy({where: {id: notificationId}});
    }

    async removeNotificationFromUser(userId: number, notificationId: number) {
        const uObj = await this.userRepository.findOne({
            where: {id: userId},
            include: {model: Notifications, where: {id: notificationId}}
        })
        if (uObj && uObj.notifications.length) {
            const nObj = uObj.notifications[0];
            const objDestroy = await nObj.destroy()

            this.socketService.dispatchNotificationMsg(userId);

            return objDestroy
        }
    }

    async getNotificationsByUser(userId: number) {
        const curUser = await this.userRepository.findOne({
            where: {id: userId},
            include: {model: Notifications},
            plain: true
        })

        // console.log(user.notifications)
        for (const notification of curUser.notifications) {
            notificationInterpretData(notification);
        }
        return curUser.notifications
    }

    async isNotificationsByUser(userId: number) {
        return this.userRepository.count ({
                where: {id: userId},
                include: {model: Notifications}
            }
        )
    }

    private async createNotification(notificationDto: CreateNotification_Dto) {
        const user = await this.userRepository.findOne({
            where: {id: notificationDto.userId}, include: {model: Notifications}}
        )

        const notification = await this.notificationRepository.create<Notifications>(notificationDto);
        if (notification) {
            this.socketService.dispatchNotificationMsg (notificationDto.userId);
            await this.historyService.createHistoryItem(notificationDto.userId, {
                text: notificationDto.text,
                type: THistoryMsgType[THistoryMsgType.Notification],
                devId: notificationDto.deviceHex,
                uId: notificationDto.sourceUserName,
                })
        }
        return await user.$add("notifications", notification);
    }

    async createNotificationYouAreAdded(userId: number,
                                        deviceId: number,
                                        deviceName: string,
                                        devHex: string,
                                        newRole: string) {
        return await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.YOU_ARE_ADDED],
            severity: ENotificationSeverity[ENotificationSeverity.INFO],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: `You are added to device \`${deviceName}\`, role: '${newRole}'`
        })
    }

    async createNotificationYouLostAccess(userId: number,
                                          deviceId: number,
                                          devHex: string,
                                          deviceName: string) {
        return await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.YOU_LOST_ACCESS],
            severity: ENotificationSeverity[ENotificationSeverity.ERROR],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: `You lost an access to device \`${deviceName}\``
        })
    }

    async createNotificationYouAreInvited(userId: number,
                                          deviceId: number,
                                          devHex: string,
                                          deviceName: string,
                                          newRole: string) {
        return await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.YOU_ARE_INVITED],
            severity: ENotificationSeverity[ENotificationSeverity.INFO],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: `You are invited to device \`${deviceName}\`, role: '${newRole}'`
        })
    }
}
