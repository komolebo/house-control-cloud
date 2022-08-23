import {Injectable} from '@nestjs/common';
import {Notifications} from "./notification.entity";
import {ENotificationSeverity, MsgTypes, NotificationActionMap} from "./messages/msgTypes";
import {THistoryMsgType} from "../history/dto/history_dto";
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {HistoryService} from "../history/history.service";
import {SocketService} from "../../sockets/socket.service";
import {RoutineService} from "./routine.service";
import {CreateNotification_Dto} from "./dto/create_notification__dto";
import {Op} from "sequelize";


function fillActionListInNotification(notification: Notifications) {
    const notifyObj = notification["dataValues"];
    const explainInfo = NotificationActionMap(notifyObj.msgType, notifyObj);
    if (explainInfo) {
        notifyObj["actions"] = explainInfo.actions;
        // notifyObj.createdAt = moment(notifyObj.createdAt).fromNow();
    }
}

@Injectable()
export class NotificationFunctionService {
    constructor(@InjectModel(Notifications) protected readonly notificationRepository: typeof Notifications,
                @InjectModel(Users) protected readonly userRepository: typeof Users,
                protected readonly historyService: HistoryService,
                protected readonly socketService: SocketService) {}


    async removeNotificationById(notificationId: number) {
        const notification = await this.notificationRepository.findOne({
            where: {id: notificationId},
            include: Users
        })
        await notification.destroy()
        if (notification.user) {
            this.socketService.dispatchNotificationMsg([notification.user.id]);
        }
    }
    async removeNotificationObj(notificationObj: Notifications) {
        await notificationObj.destroy();
        if (notificationObj.user) {
            this.socketService.dispatchNotificationMsg([notificationObj.user.id]);
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
            fillActionListInNotification(notification);
        }
        return curUser.notifications
    }

    async countNotificationsByUser(userId: number) {
        return await this.notificationRepository.count ({
            where: {userNotificationFkId: userId},
        })
    }

    private async createNotification(notificationDto: CreateNotification_Dto) {
        const user = await this.userRepository.findOne({
            where: {id: notificationDto.userId},
            include: [Notifications]
        })

        const notification = await this.notificationRepository.create<Notifications>(notificationDto);
        if (notification) {
            this.socketService.dispatchNotificationMsg ([notificationDto.userId]);
        }
        await user.$add("notifications", notification);
        return notification
    }

    private async removeIrrelevantNotification(userId: number,
                                               notificationTypes: MsgTypes[],
                                               devId: number,
                                               uId?: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            include: {
                model: Notifications,
                where: {
                    [Op.and]: [
                        {msgType: notificationTypes},
                        devId !== undefined ? {deviceId: devId} : {},
                        uId !== undefined ? {objUserId: uId} : {},
                    ],
                },
                // include: [Users]
            }
        })
        if(!user || !user.notifications) return;

        const notificationRemoveIdList = user.notifications.map(el => el.id)
        await this.notificationRepository.destroy({ where: {id: notificationRemoveIdList} })
    }

    async createNotificationYouLostAccess(userId: number,
                                          deviceId: number,
                                          devHex: string,
                                          deviceName: string) {
        const text = `You lost access to device \`${deviceName}\``;
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.YOU_LOST_ACCESS,
            MsgTypes.YOU_GOT_ACCESS
        ], deviceId);
        await this.createNotification({
            msgType: MsgTypes.YOU_LOST_ACCESS,
            severity: ENotificationSeverity.ERROR,
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
            devId: devHex,
        })
    }
    async createNotificationYouGotAccess(userId: number,
                                         deviceId: number,
                                         devHex: string,
                                         deviceName: string,
                                         role: string) {
        const text = `You got an ${role} access to device \`${deviceName}\``;
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.YOU_GOT_ACCESS,
            MsgTypes.YOU_LOST_ACCESS
        ], deviceId)
        await this.createNotification({
            msgType: MsgTypes.YOU_GOT_ACCESS,
            severity: ENotificationSeverity.INFO,
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
            devId: devHex,
        })
    }
    async createNotificationYourRoleChanged(userId: number,
                                            deviceId: number,
                                            devHex: string,
                                            deviceName: string,
                                            role: string) {
        const text = `Your role is changed to '${role}' for device \`${deviceName}\``;
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.YOU_ARE_MODIFIED
        ], deviceId)
        await this.createNotification({
            msgType: MsgTypes.YOU_ARE_MODIFIED,
            severity: ENotificationSeverity.INFO,
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
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
        const text =`${objUserName} lost access to device \`${deviceName}\``
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.USER_LOST_ACCESS,
            MsgTypes.USER_GOT_ACCESS
        ], deviceId, objUserId)
        await this.createNotification({
            msgType: MsgTypes.USER_LOST_ACCESS,
            severity: ENotificationSeverity.INFO,
            deviceId: deviceId,
            userId: userId,
            objUserId: objUserId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
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
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.USER_IS_MODIFIED
        ], deviceId, objUserId);
        await this.createNotification({
            msgType: MsgTypes.USER_IS_MODIFIED,
            severity: ENotificationSeverity.INFO,
            deviceId: deviceId,
            userId: userId,
            objUserId: objUserId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
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
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.USER_GOT_ACCESS,
            MsgTypes.USER_LOST_ACCESS
        ], deviceId, objUserId)
        await this.createNotification({
            msgType: MsgTypes.USER_GOT_ACCESS,
            severity: ENotificationSeverity.INFO,
            deviceId: deviceId,
            userId: userId,
            objUserId: objUserId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
            devId: devHex,
            uId: objLogin
        })
    }
    async createNotificationUsersClear(userId: number,
                                       deviceId: number,
                                       devHex: string,
                                       deviceName: string) {
        const text = `User list of device \`${deviceName}\` is cleared`;
        await this.removeIrrelevantNotification(userId, [
            MsgTypes.ALL_USERS_CLEAR
        ], deviceId)
        await this.createNotification({
            msgType: MsgTypes.ALL_USERS_CLEAR,
            severity: ENotificationSeverity.ERROR,
            deviceId: deviceId,
            userId: userId,
            deviceHex: devHex,
            text: text
        })
        await this.historyService.createHistoryItem(userId, {
            text: text,
            type: THistoryMsgType.Notification,
            devId: devHex,
        })
    }
    async createNotificationAcceptUpgrade(ownerId: number,
                                          deviceId: number,
                                          objUserId: number,
                                          objUserName: string,
                                          objLogin: string,
                                          devHex: string,
                                          deviceName: string) {
        await this.removeIrrelevantNotification(ownerId, [
            MsgTypes.ACCEPT_OWNER_RIGHTS
        ], deviceId, objUserId)
        const text = `${objUserName} is going to become an owner for ${deviceName}`
        const notification = await this.createNotification({
            userId: ownerId,
            msgType: MsgTypes.ACCEPT_OWNER_RIGHTS,
            severity: ENotificationSeverity.ACTION,
            deviceId: deviceId,
            deviceHex: devHex,
            objUserId: objUserId,
            objUserName: objUserName,
            text: text
        })
        await this.historyService.createHistoryItem(ownerId, {
            text: text,
            type: THistoryMsgType.Notification,
            devId: devHex,
            uId: objLogin
        })
        return notification
    }

    async createNotificationAcceptAccessRequest(ownerId: number,
                                                deviceId: number,
                                                objUserId: number,
                                                objUserName: string,
                                                objLogin: string,
                                                devHex: string,
                                                deviceName: string) {
        await this.removeIrrelevantNotification(ownerId, [
            MsgTypes.ACCEPT_USER_ADD
        ], deviceId, objUserId)
        const text = `${objUserName} is asking for an access to ${deviceName}`
        const notification = await this.createNotification({
            userId: ownerId,
            msgType: MsgTypes.ACCEPT_USER_ADD,
            severity: ENotificationSeverity.ACTION,
            deviceId: deviceId,
            deviceHex: devHex,
            objUserId: objUserId,
            objUserName: objUserName,
            text: text
        })
        await this.historyService.createHistoryItem(ownerId, {
            text: text,
            type: THistoryMsgType.Notification,
            devId: devHex,
            uId: objLogin
        })
        return notification
    }
}
