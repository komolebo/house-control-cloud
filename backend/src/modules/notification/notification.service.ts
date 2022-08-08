import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {CreateNotification_Dto} from "./dto/create_notification__dto";
import {Users} from "../users/user.entity";
import {ENotificationSeverity, ENotificationTypes, ExplainNotificationMap} from "./messages/ENotificationTypes";
import {SocketService} from "../../sockets/socket.service";
import {HistoryService} from "../history/history.service";
import {THistoryMsgType} from "../history/dto/history_dto";
import {Devices} from "../devices/device.entity";


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
    constructor(@InjectModel(Notifications) protected readonly notificationRepository: typeof Notifications,
                @InjectModel(Users) protected readonly userRepository: typeof Users,
                protected readonly historyService: HistoryService,
                protected readonly socketService: SocketService) {}

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

    async countNotificationsByUser(userId: number) {
        return await this.notificationRepository.count ({
            where: {sourceUserId: userId},
        })
    }


    private async createNotification(notificationDto: CreateNotification_Dto) {
        const user = await this.userRepository.findOne({
            where: {id: notificationDto.userId},
            include: [Notifications]
        })

        const notification = await this.notificationRepository.create<Notifications>(notificationDto);
        if (notification) {
            this.socketService.dispatchNotificationMsg (notificationDto.userId);
        }
        return await user.$add("notifications", notification);
    }

    async createNotificationYouLostAccess(userId: number,
                                          deviceId: number,
                                          devHex: string,
                                          deviceName: string) {
        const text = `You lost an access to device \`${deviceName}\``;
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.YOU_LOST_ACCESS],
            severity: ENotificationSeverity[ENotificationSeverity.ERROR],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
        })
    }
    async createNotificationYouGotAccess(userId: number,
                                         deviceId: number,
                                         devHex: string,
                                         deviceName: string) {
        const text = `You got an access to device \`${deviceName}\``;
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.YOU_GOT_ACCESS],
            severity: ENotificationSeverity[ENotificationSeverity.INFO],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
        })
    }
    async createNotificationYourRoleChanged(userId: number,
                                            deviceId: number,
                                            devHex: string,
                                            deviceName: string,
                                            role: string) {
        const text = `Your role is changed to '${role}' for device \`${deviceName}\``;
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.YOU_ARE_MODIFIED],
            severity: ENotificationSeverity[ENotificationSeverity.INFO],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
        })
    }
    async createNotificationUserLostAccess(userId: number,
                                           objUserName: string,
                                           objUserId: number,
                                           objLogin: string,
                                           deviceId: number,
                                           devHex: string,
                                           deviceName: string) {
        const text =`${objUserName} lost an access to device \`${deviceName}\``
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.USER_LOST_ACCESS],
            severity: ENotificationSeverity[ENotificationSeverity.ERROR],
            deviceId: deviceId,
            userId: userId,
            sourceUserId: objUserId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
            uId: objLogin
        })
    }
    async createNotificationUserRoleChanged(userId: number,
                                            objUserName: string,
                                            objUserId: number,
                                            objLogin: string,
                                            deviceId: number,
                                            devHex: string,
                                            deviceName: string,
                                            role: string) {
        const text =`Role of ${objUserName} is changed to ${role} for device \`${deviceName}\``
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.USER_IS_MODIFIED],
            severity: ENotificationSeverity[ENotificationSeverity.ERROR],
            deviceId: deviceId,
            userId: userId,
            sourceUserId: objUserId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
            uId: objLogin
        })
    }
    async createNotificationUserGotAccess(userId: number,
                                          objUserName: string,
                                          objUserId: number,
                                          objLogin: string,
                                          deviceId: number,
                                          devHex: string,
                                          deviceName: string,
                                          role: string) {
        const text =`${objUserName} got '${role}' access to device \`${deviceName}\``
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.USER_GOT_ACCESS],
            severity: ENotificationSeverity[ENotificationSeverity.INFO],
            deviceId: deviceId,
            userId: userId,
            sourceUserId: objUserId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
            uId: objLogin
        })
    }
    async createNotificationUsersClear(userId: number,
                                       deviceId: number,
                                       devHex: string,
                                       deviceName: string) {
        const text = `User list of device \`${deviceName}\` is cleared`;
        await this.createNotification({
            msgType: ENotificationTypes[ENotificationTypes.ALL_USERS_CLEAR],
            severity: ENotificationSeverity[ENotificationSeverity.ERROR],
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType[THistoryMsgType.Notification],
            devId: devHex,
        })
    }
}
