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

    async bindDeviceWithUser(userId : number,
                             deviceId: number,
                             role: string) {
        const isRoleValid = Object.values(RoleValues).map(el => el.toString()).includes(role)
        if (!isRoleValid)
            throw new HttpException("Invalid role value", HttpStatus.BAD_REQUEST)

        const user = await this.usersRepository.findByPk(userId)
        const device = await this.deviceRepository.findOne({
            where: {id: deviceId},
            include: [Users]
        });
        if (!user)
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        if (!device)
            throw new HttpException('Device does not exist', HttpStatus.NOT_FOUND);
        if (this.isUserIdConnectedToDevice(userId, device))
            throw new HttpException("User already connected to device", HttpStatus.CONFLICT)

        return user.$add('devices', device, {through: {role: role}});
    }

    async unbindDeviceFromUser(userId : number,
                               deviceId: number) {
        const user = await this.usersRepository.findByPk(userId)
        const device = await this.deviceRepository.findOne({
            where: {id: deviceId},
            include: [Users]
        });

        if (!this.isUserIdConnectedToDevice(userId, device))
            throw new HttpException("User is not connected to device", HttpStatus.BAD_REQUEST)
        if (!user)
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        if (!device)
            throw new HttpException('Device does not exist', HttpStatus.NOT_FOUND);

        return user.$remove('devices', device);
    }

    async getDevices() {
        return await this.deviceRepository.findAll();
    }

    async getDevicesPerUser(user_id: number) {
        const result = []
        const curUser = await this.usersRepository.findOne({
            where: {id: user_id},
            include: [{
                model: Devices,
                include: [ {
                    model: Users
                }]
            }],
        })
        if (!curUser) return;

        const devices = curUser.devices;
        for (const device of devices) {
            let canUnsubscribe = true;
            if (device.get("Roles")["dataValues"].role === RoleValues.Owner) {
                const isOwner = await this._isUserAnOwner(user_id, device);
                const ownerCount = await this._calcOwnerPerDevice(device)

                canUnsubscribe = !(isOwner && ownerCount === 1)
            }
            const {users, ...other} = device["dataValues"]
            result.push({ ...other, "canUnsubscribe": canUnsubscribe })
        }

        return result
    }

    async accessDeviceByHex(hexId: string, thisUserId: number, role: string) {
        hexId = hexId.toLowerCase()

        const device = await this.deviceRepository.findOne({
            where: {hex: hexId},
            include: {model: Users}
        })
        if (!device)
            throw new HttpException("Device cannot be empty", HttpStatus.NOT_FOUND)

        if(device.users.length) {
            throw new HttpException("Device already owned to be owned again", HttpStatus.BAD_REQUEST)
        } else {
            const res = await this.bindDeviceWithUser(
                thisUserId,
                device.id,
                role)

            await this.notificationService.createNotificationYouAreAdded(
                thisUserId, device.id, device.name, device.hex, role)
            return res
        }
    }

    async unsubscribeFromDeviceByHex(hexId: string, thisUserId: number) {
        const device = await this.deviceRepository.findOne({
            where: {hex: hexId},
            include: {model: Users}
        })

        const manyOwners = await this._calcOwnerPerDevice(device) > 1
        const isOwner = await this._isUserAnOwner(thisUserId, device)

        // remove myself if you're not the single left OWNER
        const curUser = device.users.find(el => el.id === thisUserId)
        if (!isOwner || manyOwners) {
            await device.$remove("users", curUser);
        } else {
            throw new HttpException("Last owner cannot unsubscribe",
                HttpStatus.FORBIDDEN)
        }
        return device
    }

    async clearUsersOfDevice(hexId: string, thisUserId: number) {
        console.log("clearUsersOfDevice:", hexId, thisUserId)
        const device = await this.deviceRepository.findOne({
            where: { hex: hexId },
            include: {model: Users},
        });

        // if you're an OWNER for current device
        if (device && device.users.length) {
            const rmUsers = device.users;
            const curUser = rmUsers.find(el => el.id === thisUserId);

            // yes, you are OWNER -> remove everyone
            if (curUser.get("Roles")["dataValues"].role === RoleValues.Owner) {
                const res = await device.$remove("Users", device.users)
                if (!res) throw new HttpException("Clear users failed", HttpStatus.METHOD_NOT_ALLOWED)
                rmUsers.forEach(u => {
                    this.notificationService.createNotificationYouLostAccess(
                        u.id, device.id, device.hex, device.name,
                    )
                })
            }
        } else throw "Device empty or no user connected"

        return device
    }

    async modifyRoleAccess(uId: number, thisUID: number, devHex: string, newRole: RoleValues) {
        console.log("modifyRoleAccess, uid=", uId, "hex=", devHex, " by req of:", thisUID, " role:", newRole);

        // check if you are an owner for this device
        const device = await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        })

        if (!device || !device.users) throw new HttpException("Device data not found", HttpStatus.NOT_FOUND)

        const objUser = device.users.find(el => el.id === uId);

        if (! await this._isUserAnOwner (uId, device)) {
            const role = objUser["dataValues"]["Roles"]
            const result = role.set("role", newRole)
            await role.save()
            return result
        }

        throw new HttpException("User role not changed", HttpStatus.NOT_FOUND)
    }

    async removeRole(uId: number, thisUID: number, devHex: string) {
        console.log("removeRole, uid=", uId, "hex=", devHex, " by req of:", thisUID);

        // check if you are an owner for this device
        const device = await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        })

        if(!device || !device.users) throw new HttpException("Incorrect device data", HttpStatus.NOT_FOUND)

        const objUser = device.users.find(el => el.id === uId);

        const thisUserIsOwner = await this._isUserAnOwner(thisUID, device);
        const objUserIsOwner = await this._isUserAnOwner(uId, device);

        if (thisUserIsOwner && !objUserIsOwner) {
            const result = await device.$remove("users", objUser);
            if (result) {
                return device
            }
        }
        throw new HttpException("User is not restrocted from device", HttpStatus.NOT_MODIFIED)
    }

    async inviteUser(uLogin: string, thisUID: number, devHex: string, role: string) {
        const objUser = await this.usersRepository.findOne({where: {login: uLogin}})
        if(!objUser) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND)

        console.log("inviteUser, uLogin=", uLogin, "hex=", devHex, " by req of:", thisUID, " role=", role);
        uLogin = uLogin.toLowerCase()

        // check if you are an owner for this device
        const device = await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        })
        if(!device || !device.users) throw new HttpException("Incorrect device data", HttpStatus.NOT_FOUND)

        if (!this._isUserLoginConnectedToDevice(uLogin, device)) {
            const result = await device.$add('users', objUser, {through: {role: role}});
            if (result) {
                await this.notificationService.createNotificationYouAreInvited(
                    objUser.id, device.id, device.name, device.hex, role)
                return device
            }
            throw new HttpException("User is not invited", HttpStatus.NOT_MODIFIED)
        } else throw new HttpException("User already connected", HttpStatus.CONFLICT)
    }

    async _isUserAnOwner(uId: number, device: Devices, isDevWithUsers: boolean = true) {
        if (!device) return false;
        if (isDevWithUsers && !device.users)
            return false;

        const connUsers = isDevWithUsers ? device.users : await device.$get("users")
        const user = connUsers.find(el => el.id === uId)
        return user && user.get("Roles")["dataValues"].role === RoleValues.Owner
    }
    isUserIdConnectedToDevice(uId: number, deviceIncUsers: Devices) {
        if (!deviceIncUsers || !deviceIncUsers.users) return false;
        return deviceIncUsers.users.find (el => el.id === uId) !== undefined
    }
    _isUserLoginConnectedToDevice(login: string, device: Devices) {
        if (!device || !device.users) return false;
        return device.users.find (el => el.login === login) !== undefined
    }
    async _calcOwnerPerDevice(device: Devices, isDevWithUsers: boolean = true) {
        if (!device) throw "Device is empty";
        if (isDevWithUsers && !device.users) throw "Device does not have users"

        const connUsers = isDevWithUsers ? device.users : await device.$get ("users");
        return connUsers.filter(u =>
            u.get ('Roles')['dataValues'].role === RoleValues.Owner)
            .length
    }
}
