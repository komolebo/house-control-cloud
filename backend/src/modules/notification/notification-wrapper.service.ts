import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Notifications} from "./notification.entity";
import {Users} from "../users/user.entity";
import {SocketService} from "../../sockets/socket.service";
import {HistoryService} from "../history/history.service";
import {Devices} from "../devices/device.entity";
import {NotificationService} from "./notification.service";

@Injectable()
export class NotificationWrapService extends NotificationService {
    constructor(@InjectModel(Notifications) protected readonly notificationRepository: typeof Notifications,
                @InjectModel(Users) protected readonly userRepository: typeof Users,
                protected readonly historyService: HistoryService,
                protected readonly socketService: SocketService) {
        super (notificationRepository, userRepository, historyService, socketService);}

    async handleLostAccess(owners: Array<Users>, objUser: Users, device: Devices) {
        for (const owner of owners) {
            if (owner.id !== objUser.id) {
                await this.createNotificationUserLostAccess(owner.id,
                    objUser.full_name,
                    objUser.id,
                    objUser.login,
                    device.id,
                    device.hex,
                    device.name)
            }
        }
        await this.createNotificationYouLostAccess(objUser.id,
            device.id, device.hex, device.name)
    }

    async handleClearUsers(users: Array<Users>, objUser: Users, device: Devices) {
        for (const user of users) {
            await this.createNotificationUsersClear(user.id,
                device.id,
                device.hex,
                device.name)
        }
    }
    async handleAddUser(owners: Array<Users>, objUser: Users, device: Devices, role: string) {
        for (const owner of owners) {
            if (owner.id !== objUser.id) {
                await this.createNotificationUserGotAccess(owner.id,
                    objUser.full_name,
                    objUser.id,
                    objUser.login,
                    device.id,
                    device.hex,
                    device.name,
                    role)
            }
        }
        await this.createNotificationYouGotAccess(objUser.id,
            device.id, device.hex, device.name, role)
    }

    async handleModifyUser(owners: Array<Users>, objUser: Users, device: Devices, role: string) {
        for (const owner of owners) {
            if (owner.id !== objUser.id) {
                await this.createNotificationUserRoleChanged(owner.id,
                    objUser.full_name,
                    objUser.id,
                    objUser.login,
                    device.id,
                    device.hex,
                    device.name,
                    role)
            }
        }
        await this.createNotificationYourRoleChanged(objUser.id,
            device.id, device.hex, device.name, role)
    }

}
