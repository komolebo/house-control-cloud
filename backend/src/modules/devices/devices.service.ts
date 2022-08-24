import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Devices} from "./device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {Users} from "../users/user.entity";
import {RoleValues} from "./dto/roles__dto";
import {Roles} from "./role.entity";
import {NotificationService} from "../notification/notification-wrapper.service";
import {RoutineService} from "../notification/routine.service";
import {SocketService} from "../../sockets/socket.service";
import {InviteUser_Dto} from "./dto/cruDto";

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                @InjectModel(Users) private readonly  usersRepository: typeof Users,
                private notificationService: NotificationService,
                private routineService: RoutineService,
                private socketService: SocketService) { }

    private logger = new Logger(DevicesService.name);

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

        const result = await user.$add('devices', device, {through: {role: role}});

        if (result) {
            await this.notificationService.handleAddUser(
                this._getOwnersListPerDevice(device),
                user,
                device,
                role
            )
            return HttpStatus.CREATED
        }
        throw new HttpException("User not added to device", HttpStatus.BAD_REQUEST)
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
            throw new HttpException("Device does not exist", HttpStatus.NOT_FOUND)
        if (device.users.map(el => el.id).includes(thisUserId))
            throw new HttpException("User already connected to device", HttpStatus.NOT_FOUND)

        if(device.users.length) {
            // throw new HttpException("Device already owned to be owned again", HttpStatus.BAD_REQUEST)
            const owners = await this._getOwnersListPerDevice(device);
            const objUser = await this.usersRepository.findByPk(thisUserId);
            await this.routineService.createRoutineUserGrantAccess(
                device,
                owners,
                objUser)
            return HttpStatus.ACCEPTED
        } else {
            // await this.notificationService.createNotificationYouAreAdded(
            //     thisUserId, device.id, device.name, device.hex, role)
            return await this.bindDeviceWithUser (
                thisUserId,
                device.id,
                role)
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
            await this.notificationService.handleLostAccess(
                this._getOwnersListPerDevice(device),
                curUser,
                device
            )
        } else {
            throw new HttpException("Last owner cannot unsubscribe",
                HttpStatus.FORBIDDEN)
        }
        return device
    }

    async clearUsersOfDevice(hexId: string, thisUserId: number) {
        this.logger.warn(`clearUsersOfDevice: ${hexId} by userId=${thisUserId}`)
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

                await this.notificationService.handleClearUsers(
                    rmUsers,
                    curUser,
                    device
                )

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
        this.logger.warn(`modifyRoleAccess: uid=${uId}, hex=${devHex}, by req of userId=${thisUID}, role=${newRole}`);

        // check if you are an owner for this device
        const device = await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        })

        if (!device || !device.users)
            throw new HttpException("Device data not found", HttpStatus.NOT_FOUND)
        if (!await this._isUserAnOwner(thisUID, device))
            throw new HttpException("You need to be an owner to modify roles", HttpStatus.FORBIDDEN)
        if (await this._isUserAnOwner(uId, device)) {
            throw new HttpException("Cannot modify role of owner", HttpStatus.FORBIDDEN)
        }

        const objUser = device.users.find(el => el.id === uId);
        const manyOwners = await this._calcOwnerPerDevice(device) > 1;
        if(newRole === RoleValues.Owner && manyOwners) {
            // coordinate access rights upgrade to OWNER between all owners
            await this.setModifyOwnerRoutine(device, thisUID, objUser);
            return HttpStatus.ACCEPTED
        } else {
            await this.setNewRole (objUser, newRole, device);
            return HttpStatus.CREATED
        }
    }

    private async setModifyOwnerRoutine(device: Devices, thisUID: number, objUser: Users) {
        const allOwners = await this._getOwnersListPerDevice (device)
        await this.routineService.createRoutineModifyToOwner (device,
            allOwners.filter (el => el.id !== thisUID),
            objUser)
    }

    async setNewRole(objUser: Users, newRole: RoleValues, device: Devices) {
        if(!objUser) throw new HttpException("Incorrect user data", HttpStatus.NOT_FOUND);

        const objUserIsConnected = objUser.get('Roles');
        if(objUserIsConnected) {
            const objRole = objUser["dataValues"]["Roles"]
            objRole.set ("role", newRole)
            await objRole.save ()
            await this.notificationService.handleModifyUser (
                this._getOwnersListPerDevice (device),
                objUser,
                device,
                newRole
            )
        }
        else {
            await this.addUserToDevice(device, objUser, newRole)
        }
        this.socketService.dispatchDevUpdateMsg(device.users.map(el => el.id))
        return HttpStatus.CREATED;
    }

    async removeRole(uId: number, thisUID: number, devHex: string) {
        this.logger.warn(`removeRole: uid=${uId}, hex${devHex}, by req of ${thisUID}`);

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
                await this.notificationService.handleLostAccess(
                    this._getOwnersListPerDevice(device),
                    objUser,
                    device
                )
                return device
            }
        }
        throw new HttpException("User is not restrocted from device", HttpStatus.NOT_MODIFIED)
    }

    async inviteUser(thisUID: number, devHex: string, inviteUser_Dto: InviteUser_Dto) {
        const objUser = await this.usersRepository.findOne({where: {login: inviteUser_Dto.login}})
        if(!objUser) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND)

        this.logger.warn(`inviteUser: uLogin=${inviteUser_Dto.login} hex=${devHex} by req 
            of thisUid=${thisUID} role=${inviteUser_Dto.role}`);

        const device = await this.deviceRepository.findOne({
            where: {hex: devHex},
            include: {model: Users},
        })
        if(!device || !device.users) throw new HttpException("Incorrect device data", HttpStatus.NOT_FOUND)

        if (this._isUserLoginConnectedToDevice(inviteUser_Dto.login, device)) {
            throw new HttpException(`User ${inviteUser_Dto.login} already connected to device ${device.hex}`, HttpStatus.CONFLICT)
        }

        if (inviteUser_Dto.role === RoleValues.Owner) {
            await this.setModifyOwnerRoutine(device, thisUID, objUser);
            return HttpStatus.ACCEPTED;
        }
        await this.addUserToDevice (device, objUser, inviteUser_Dto.role);
        return HttpStatus.CREATED;
        // throw new HttpException("User is not invited", HttpStatus.NOT_MODIFIED)
    }

    async addUserToDevice(device: Devices, objUser: Users, role: string) {
        const owners = this._getOwnersListPerDevice (device);
        await device.$add ('users', objUser, {through: {role: role}});
        await this.notificationService.handleAddUser (
            owners,
            objUser,
            device,
            role
        )
        this.socketService.dispatchDevUpdateMsg([
            objUser.id, ...owners.map(el => el.id)
        ])
        // await this.notificationService.createNotificationYouAreInvited(
        //     objUser.id, device.id, device.name, device.hex, role)
        return device
    }

    async updateDeviceAlias(thisUID: number, devHex: string, alias: string) {
        const user = await this.usersRepository.findOne({
            where: {id: thisUID},
            include: [Devices]
        })
        if(!user || !user.devices) throw new HttpException("No user data", HttpStatus.NOT_FOUND);

        const device = user.devices.find(el => el.hex === devHex);
        await user.$add('devices', device, {through: {alias: alias}});

        return user
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
    _getOwnersListPerDevice(device: Devices) {
        if (!device || !device.users) return []
        return device.users.filter(el => el.get('Roles')["dataValues"].role === RoleValues.Owner)
    }
}
