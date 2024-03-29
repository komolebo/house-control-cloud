import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {NotificationCmd} from "./messages/msgTypes";
import {ERoutineType} from "./dto/routineTypes";
import {Notifications} from "./notification.entity";
import {Routines} from "./routine.entity";
import {RoleValues} from "../devices/dto/roles__dto";
import {Users} from "../users/user.entity";
import {DevicesService} from "../devices/devices.service";
import {NotificationFunctionService} from "./notification-function.service";
import {Devices} from "../devices/device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {SocketService} from "../../sockets/socket.service";
import {Op} from "sequelize";
import {PreferenceService} from "../preference/preference.service";

@Injectable()
export class RoutineService {
    constructor(@InjectModel (Routines) private routineRepository: typeof Routines,
                @InjectModel (Notifications) private notificationRepository: typeof Notifications,
                @InjectModel (Users) private userRepository: typeof Users,
                @InjectModel (Devices) private deviceRepository: typeof Devices,
                @Inject(forwardRef(() => DevicesService)) private deviceService: DevicesService,
                private notificationService: NotificationFunctionService,
                private preferenceService: PreferenceService,
                private socketService: SocketService) {}

    private async _isRoutineExist(type: ERoutineType, devId: number, objUserId: number) {
        const routine = await this.routineRepository.findOne({
            where: {
                [Op.and]: [
                    {type: type},
                    {objDeviceId: devId},
                    {objUserId: objUserId}
                ]
            }
        })
        return routine !== null
    }

    private async _removeRoutine(routine: Routines) {
        const notificationIdList = routine.notifications.map(n => n.userNotificationFkId)
        await routine.destroy()
        this.socketService.dispatchNotificationMsg(notificationIdList);
    }

    private async _createRoutine(deviceWithUsers: Devices,
                                 objUser: Users,
                                 routineType: ERoutineType) {
        if (await this._isRoutineExist(routineType, deviceWithUsers.id, objUser.id)) {
            throw new HttpException("Request already pending", HttpStatus.CONFLICT);
        }
        return await this.routineRepository.create({
            type: routineType,
            objDeviceId: deviceWithUsers.id,
            objUserId: objUser.id
        })
    }

    async createRoutineModifyToOwner(deviceWithUsers: Devices,
                                     restOwners: Users[],
                                     objUser: Users) {
        const routine = await this._createRoutine(deviceWithUsers, objUser, ERoutineType.ACCEPT_MEMBER_BECOME_OWNER)

        for (const owner of restOwners) {
            const notification = await this.notificationService.createNotificationAcceptUpgrade(
                owner.id,
                deviceWithUsers.id,
                objUser.id,
                objUser.full_name,
                objUser.login,
                deviceWithUsers.hex,
                deviceWithUsers.name
            )
            await routine.$add("notifications", notification)
        }
    }

    async createRoutineUserGrantAccess(deviceWithUsers: Devices,
                                 owners: Users[],
                                 objUser: Users) {
        const notifications = [];
        for (const owner of owners) {
            if (!await this.preferenceService.isUserIdBlockedByUserId(owner.id, objUser.id)) {
                notifications.push(await this.notificationService.createNotificationAcceptAccessRequest(
                    owner.id,
                    deviceWithUsers.id,
                    objUser.id,
                    objUser.full_name,
                    objUser.login,
                    deviceWithUsers.hex,
                    deviceWithUsers.name
                ))
            }
            // await routine.$add("notifications", notification)
        }
        if (notifications.length) {
            const routine = await this._createRoutine(deviceWithUsers, objUser, ERoutineType.ACCEPT_USER_GRANT_ACCESS)
            await routine.$set("notifications", notifications);
        }
    }

    async processModifyToOwner(notification: Notifications, routine: Routines, cmd: NotificationCmd) {
        if (cmd === NotificationCmd.Close) {
            // if close -> remove routine, request is ignored
            await this._removeRoutine(routine);
        } else if (cmd === NotificationCmd.Accept) {
            // Accept -> remove notification, check routine is completed
            // await routine.$remove("notifications", notification)
            const isLastNotification = routine.notifications.length === 1;
            if (isLastNotification) {
                const device = await this.deviceRepository.findByPk(routine.objDeviceId, {include: Users});
                const objUser = await this.userRepository.findByPk(routine.objUserId);
                await this.deviceService.setNewRole(objUser, RoleValues.Owner, device)
            }
            await this._removeRoutine(routine)
        }
    }

    async processGrantAccess(notification: Notifications, routine: Routines, cmd: NotificationCmd) {
        if (cmd === NotificationCmd.Close || cmd === NotificationCmd.Block) {
            // if close -> if no more user notifications -> remove routine
            const isLastNotification = routine.notifications.length === 1;
            if (isLastNotification) {
                await this._removeRoutine(routine);
            } else {
                await this.notificationService.removeNotificationObj(notification);
            }
        } else if (cmd === NotificationCmd.Accept) {
            // if at least 1 accept => complete the routine
            const objUser = await this.userRepository.findByPk(routine.objUserId);
            const device = await this.deviceRepository.findByPk(routine.objDeviceId, {include: Users});
            await this.deviceService.addUserToDevice(device, objUser, RoleValues.Default)

            await routine.destroy()
            const notificationIdList = routine.notifications.map(el => el.userNotificationFkId);
            this.socketService.dispatchNotificationMsg(notificationIdList);
        }
    }

    async processRoutineAction(notifId: number,
                               cmd: NotificationCmd) {
        const notification = await this.notificationRepository.findOne({
            where: {id: notifId},
            include: {
                model: Routines,
                include: [ Notifications ]
            }
        })

        if(!notification) throw new HttpException("Notification not found", HttpStatus.NOT_FOUND)

        if(!notification.routine) return
        switch (notification.routine.type) {
            case ERoutineType.ACCEPT_MEMBER_BECOME_OWNER:
                await this.processModifyToOwner(notification, notification.routine, cmd);
                break;
            case ERoutineType.ACCEPT_USER_GRANT_ACCESS:
                await this.processGrantAccess(notification, notification.routine, cmd);
                break;
        }

        if (cmd === NotificationCmd.Block) {
            await this.preferenceService.putUIdToBlackList(notification.userNotificationFkId, notification.objUserId);
        }
    }

    async processRoutineNotificationRemove(notifId: number) {
        await this.processRoutineAction(notifId, NotificationCmd.Close);
    }
}
