import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {CreateNotification_Dto} from "./dto/create_notification__dto";
import {Users} from "../users/user.entity";
import {ExplainNotificationMap} from "./messages/ENotificationTypes";
import * as moment from 'moment'


function notificationInterpretData(notification: Notifications) {
    const notifyObj = notification["dataValues"];
    // console.log("checking ", notifyObj.msgType, ExplainNotificationMap[notifyObj.msgType])
    const explainInfo = ExplainNotificationMap(notifyObj.msgType, notifyObj);
    if (!notifyObj.text && explainInfo) {
        notifyObj["actions"] = explainInfo.actions;
        notifyObj["text"] = explainInfo.text;
        notifyObj.createdAt = moment(notifyObj.createdAt).fromNow();
    }
}

@Injectable()
export class NotificationService {
    constructor(@InjectModel(Notifications) private readonly notificationRepository: typeof Notifications,
                @InjectModel(Users) private readonly userRepository: typeof Users) {}

    async create(notification: CreateNotification_Dto) {
        // return await this.notificationRepository.create<Notifications>(notification);
    }

    async remove(notificationId: number) {
        return await this.notificationRepository.destroy({where: {id: notificationId}});
    }

    async removeNotificationFromUser(notificationId: number, userId: number) {
        const uObj = await this.userRepository.findOne({
            where: {id: userId},
            include: {model: Notifications, where: {id: notificationId}}
        })
        if (uObj && uObj.notifications.length) {
            const nObj = uObj.notifications[0];
            return await nObj.destroy()
            // return await uObj.$remove("notifications", nObj)
        }
    }

    async getNotificationsByUser(userId: number) {
        return await this.userRepository.findOne(
            {where: {id: userId}, include: {model: Notifications}, plain: true})
            .then(user => {
                // console.log(user.notifications)
                user.notifications.forEach(el => {
                    notificationInterpretData(el);
                })
                return user.notifications
            })
    }

    async isNotificationsByUser(userId: number) {
        return await this.userRepository.findOne(
            {where: {id: userId}, include: {model: Notifications}, plain: true})
            .then(user => {
                return user.notifications.length
            })
    }

    // @IsNotEmpty()
    // readonly userId: number;
    //
    // @IsNotEmpty()
    // readonly msgType: ENotificationTypes;
    //
    // @IsNotEmpty()
    // readonly severity: ENotificationSeverity;
    //
    // readonly deviceId?: string;
    //
    // readonly sourceUserId?: number;

    async createNotification(notificationDto: CreateNotification_Dto) {
        const user = await this.userRepository.findOne({
            where: {id: notificationDto.userId}, include: {model: Notifications}}
        )

        const notification = await this.notificationRepository.create<Notifications>(notificationDto)

        await user.$add("notifications", notification);

        // const notification = this.notificationRepository.create({
        //     deviceId: notificationDto.deviceId,
        //     sourceUserId: notificationDto.sourceUserId,
        //     severity: notificationDto.severity,
        //     msgType: notificationDto.msgType
        // })
    }
}
