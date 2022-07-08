import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Devices} from "./device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {Users} from "../users/user.entity";
import {RoleValues} from "./dto/roles__dto";
import {Roles} from "./role.entity";
import {NotificationService} from "../notification/notification.service";
import {ENotificationSeverity, ENotificationTypes} from "../notification/messages/ENotificationTypes";

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                @InjectModel(Users) private readonly  usersRepository: typeof Users,
                private notificationService: NotificationService) { }

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
            include: {model: Devices},
            plain: true
        })
        if (!curUser) return;

        const devices = curUser.devices;
        let promises: Array<any> = [];

        devices.map((device) => {
            device["dataValues"]["canUnsubscribe"] = true;
            if (device.get("Roles")["dataValues"].role === RoleValues.Owner) {
                promises.push(device.$get("users").then(conn_users => {
                    let manyOwners = false;
                    conn_users.forEach(u => {
                        if (u.id !== user_id && u.get("Roles")["dataValues"].role === RoleValues.Owner) {
                            manyOwners = true;
                        }
                    })
                    device["dataValues"]["canUnsubscribe"] = manyOwners
                }));
            }
        })
        await Promise.all(promises)

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

    async accessDeviceByHex(hexId: string, thisUserId: number) {
        console.log("Requesting access to ", hexId, " for user=", thisUserId)
        hexId = hexId.toLowerCase()

        const deviceWithUsers = await this.deviceRepository.findOne({
            where: {hex: hexId}, include: {model: Users}
        })
        const users = deviceWithUsers.users;
        if(users.length) {
            console.log("Device already owned") // TODO
        } else {
            const res = await this.bindDeviceWithUser(thisUserId, deviceWithUsers.id, true, RoleValues.Owner)
            await this.notificationService.createNotification({
                userId: thisUserId,
                msgType: ENotificationTypes[ENotificationTypes.YOU_ARE_ADDED],
                deviceId: deviceWithUsers.id,
                severity: ENotificationSeverity[ENotificationSeverity.INFO]
            })
            return res
        }
    }

    async unsubscribeFromDeviceByHex(hexId: string, thisUserId: number) {
        let curRole = null;
        let ownersCount = 0;

        const deviceWithUsers = await this.deviceRepository.findOne({
            where: {hex: hexId},
            include: {model: Users}
        })
        const conn_users = deviceWithUsers.users;

        conn_users.forEach(el => {
            const role = el.get("Roles")["dataValues"].role;
            const uId = el.id;

            if (uId === thisUserId) curRole = role;
            if (role === "OWNER") ownersCount += 1;
        })

        // remove myself if you're not the single left OWNER
        const curUser = conn_users.find(el => el.id === thisUserId)
        if (curRole !== "OWNER" || ownersCount > 1) {
            return await deviceWithUsers.$remove("users", curUser)
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

            // yes, you are OWNER -> remove everyone
            if (curUser.get("Roles")["dataValues"].role === RoleValues.Owner) {
                return await deviceWithUsers.$remove("Users", deviceWithUsers.users)
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
            const thisUser = d.users.find(el => el.id === thisUID);
            const objUser = d.users.find(el => el.id === uId);

            if (thisUser.get("Roles")["dataValues"].role === RoleValues.Owner &&
                objUser.get("Roles")["dataValues"].role !== RoleValues.Owner) {
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

    async inviteUser(uId: number, thisUID: number, devHex: string, role: string) {
        console.log("inviteUser, uid=", uId, "hex=", devHex, " by req of:", thisUID, " role=", role);

        // check if you are an owner for this device
        await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        }).then(d => {
            const thisUser = d.users.find(el => el.id === thisUID);
            const usrAlreadyInvited = d.users.find(el => el.id === uId) !== undefined;

            console.log(thisUser);
            console.log(thisUser.get("Roles")["dataValues"].role);

            if (thisUser.get("Roles")["dataValues"].role === RoleValues.Owner &&
                !usrAlreadyInvited) {
                this.usersRepository.findOne({where: {id: uId}})
                    .then(objUser => {
                        d.$add('users', objUser, {through: {role: role}});
                    })
            }
        })
    }
}
