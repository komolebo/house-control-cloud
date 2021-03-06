import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Devices} from "./device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {Users} from "../users/user.entity";
import {RoleValues} from "./dto/roles__dto";
import {Roles} from "./role.entity";
import {NotificationService} from "../notification/notification.service";
import {SocketService} from "../../sockets/socket.service";

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                @InjectModel(Users) private readonly  usersRepository: typeof Users,
                private notificationService: NotificationService,
                private socketService: SocketService) { }

    async create(new_device: CreateDevice_Dto): Promise<Devices> {
        return await this.deviceRepository.create<Devices>(new_device);
    }

    async bindDeviceWithUser(user_id : number, device_id: number,
                             connect_status: boolean,
                             role?: RoleValues) {
        return await this.usersRepository.findOne({where: {id: user_id}})
            .then(user => {
                if (!user) return new HttpException('Some error', HttpStatus.NOT_FOUND);

                this.deviceRepository.findOne({where: {id: device_id}})
                    .then(device => {
                        if (connect_status) {
                            console.log("received role: ", role);
                            if (role === undefined) role = RoleValues.Default;

                            user.$add('devices', device, {through: {role: role}});
                        } else {
                            user.$remove('devices', device);
                        }
                        return user;
                    })
            })
    }

    async getDevices() {
        return await this.deviceRepository.findAll();
    }

    async getDevicesPerUser(user_id: number) {
        console.log(user_id)
        const curUser = await this.usersRepository.findOne({
            where: {id: user_id},
            include: [Devices],
        })
        if (!curUser) return;

        const devices = curUser.devices;
        for (const device of devices) {
            device["dataValues"]["canUnsubscribe"] = true;
            if (device.get("Roles")["dataValues"].role === RoleValues.Owner) {
                const conn_users = await device.$get("users")
                let manyOwners = false;

                for (const u of conn_users) {
                    if (u.id !== user_id && u.get("Roles")["dataValues"].role === RoleValues.Owner) {
                        manyOwners = true;
                    }
                }
                device["dataValues"]["canUnsubscribe"] = manyOwners;
            }
        }

        return devices
    }

    async getRoleByUserAndDevice(userId: number, deviceId: number): Promise<RoleValues> {
        return await this.usersRepository.findOne({where: {id: userId}})
            .then(user => {
                if (!user) return RoleValues.None;

                return user.$get('devices').then(devices => {
                    for (let dev of devices) {
                        if (dev.id == deviceId) {
                            return dev['Roles'].role;
                        }
                    }
                    return RoleValues.None;
                })
            })
    }

    async deleteDeviceById(device_id: number) {
        return await this.deviceRepository.destroy({where: {id: device_id}})
    }

    async accessDeviceByHex(hexId: string, thisUserId: number, role: string) {
        console.log("Requesting access to ", hexId, " for user=", thisUserId)
        hexId = hexId.toLowerCase()

        const device = await this.deviceRepository.findOne({
            where: {hex: hexId}, include: {model: Users}
        })
        if(device.users.length) {
            console.log("Device already owned") // TODO
        } else {
            const res = await this.bindDeviceWithUser(thisUserId, device.id, true, RoleValues[role])
            await this.notificationService.createNotificationYouAreAdded(
                thisUserId, device.id, device.name, device.hex, role)
            return res
        }
    }

    async unsubscribeFromDeviceByHex(hexId: string, thisUserId: number) {
        let curRole = null;
        let ownersCount = 0;

        const device = await this.deviceRepository.findOne({
            where: {hex: hexId},
            include: {model: Users}
        })
        const conn_users = device.users;

        conn_users.forEach(el => {
            const role = el.get("Roles")["dataValues"].role;
            const uId = el.id;

            if (uId === thisUserId) curRole = role;
            if (role === RoleValues.Owner) ownersCount += 1;
        })

        // remove myself if you're not the single left OWNER
        const curUser = conn_users.find(el => el.id === thisUserId)
        if (curRole !== RoleValues.Owner || ownersCount > 1) {
            await device.$remove("users", curUser);
            return device
        } else {}
    }

    async clearUsersOfDevice(hexId: string, thisUserId: number) {
        console.log("clearUsersOfDevice:", hexId, thisUserId)
        const deviceWithUsers = await this.deviceRepository.findOne({
            where: { hex: hexId },
            include: {model: Users},
        });

        // if you're an OWNER for current device
        if (deviceWithUsers && deviceWithUsers.users.length) {
            const curUser = deviceWithUsers.users.find(el => el.id === thisUserId);

            const rmUsers = deviceWithUsers.users;

            // yes, you are OWNER -> remove everyone
            if (curUser.get("Roles")["dataValues"].role === RoleValues.Owner) {
                const res =  await deviceWithUsers.$remove("Users", deviceWithUsers.users)
                // TODO check res
                rmUsers.forEach(u => {
                    this.notificationService.createNotificationYouLostAccess(
                        u.id, deviceWithUsers.id, deviceWithUsers.hex, deviceWithUsers.name,
                    )
                })

                return res
            }
        } else {
            console.log("Empty values")
        }

        this.deviceRepository.findOne({where: {hex: hexId}})
            .then(device => {
                device.$get("users").then(connUsers => {
                })
            })
    }

    async modifyRoleAccess(uId: number, thisUID: number, devHex: string, newRole: RoleValues) {
        console.log("modifyRoleAccess, uid=", uId, "hex=", devHex, " by req of:", thisUID, " role:", newRole);

        // check if you are an owner for this device
        await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        }).then(d => {
            const objUser = d.users.find(el => el.id === uId);

            if (objUser.get("Roles")["dataValues"].role !== RoleValues.Owner) {
                const role = objUser["dataValues"]["Roles"]
                role.set("role", newRole).save()
            }
        })
    }

    async removeRole(uId: number, thisUID: number, devHex: string) {
        console.log("removeRole, uid=", uId, "hex=", devHex, " by req of:", thisUID);

        // check if you are an owner for this device
        await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        }).then(d => {
            const thisUser = d.users.find(el => el.id === thisUID);
            const objUser = d.users.find(el => el.id === uId);

            if (thisUser.get("Roles")["dataValues"].role === RoleValues.Owner &&
                objUser.get("Roles")["dataValues"].role !== RoleValues.Owner) {
                d.$remove("users", objUser);
            }
        })
    }

    async inviteUser(uLogin: string, thisUID: number, devHex: string, role: string) {
        console.log("inviteUser, uLogin=", uLogin, "hex=", devHex, " by req of:", thisUID, " role=", role);
        uLogin = uLogin.toLowerCase()

        // check if you are an owner for this device
        await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        }).then(d => {
            if (!this.isUserLoginConnectedToDevice(uLogin, d)) {
                this.usersRepository.findOne({where: {login: uLogin}})
                    .then(objUser => {
                        if (!objUser) return;

                        d.$add('users', objUser, {through: {role: role}});
                        this.notificationService.createNotificationYouAreInvited(
                            objUser.id, d.id, d.name, d.hex, role)
                        return
                    })
            }
        })
    }

    calcOwnersPerDevice(device: Devices) {
        if (!device || !device.users) return 0;

        let owners = 0;
        device.users.forEach(u => owners += u.get('Roles')["dataValues"].role === RoleValues.Owner ? 1 : 0)

        return owners;
    }
    isUserAnOwner(uId: number, device: Devices) {
        if (!device || !device.users) return false;
        const user = device.users.find(el => el.id === uId)
        return user && user.get("Roles")["dataValues"].role === RoleValues.Owner
    }
    isUserIdConnectedToDevice(uId: number, device: Devices) {
        if (!device || !device.users) return false;
        return device.users.find (el => el.id === uId) !== undefined
    }
    isUserLoginConnectedToDevice(login: string, device: Devices) {
        if (!device || !device.users) return false;
        return device.users.find (el => el.login === login) !== undefined
    }
}
