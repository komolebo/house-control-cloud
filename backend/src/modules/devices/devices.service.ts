import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Devices} from "./device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {Users} from "../users/user.entity";
import {RoleValues} from "./dto/roles__dto";
import {Roles} from "./role.entity";

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                @InjectModel(Users) private readonly  usersRepository: typeof Users) { }

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
        return await this.usersRepository.findOne({where: {id: user_id}})
            .then(user=>{
                if(!user) return;

                return user.$get('devices');
            })
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

        this.deviceRepository.findOne({where: {hex: hexId}})
            .then(device => {
                device.$get("users").then(users => {
                    if(users.length) {
                        console.log("Device already owned")
                    } else {
                        return this.bindDeviceWithUser(thisUserId, device.id, true, RoleValues.Owner)
                    }
                })
            })
    }

    async unsubscribeFromDeviceByHex(hexId: string, thisUserId: number) {
        let curRole = null;
        let ownersCount = 0;

        this.deviceRepository.findOne({where: {hex: hexId}})
            .then(device => {
                device.$get("users")
                    .then(conn_users => {
                        conn_users.forEach(el => {
                            const role = el.get("Roles")["dataValues"].role;
                            const uId = el.id;

                            if (uId === thisUserId) curRole = role;
                            if (role === "OWNER") ownersCount += 1;
                        })
                        // remove myself if you're not the single left OWNER
                        const curUser = conn_users.find(el => el.id === thisUserId)
                        if (curRole !== "OWNER " || ownersCount > 1) {
                            device.$remove("users", curUser)
                        }
                        else {
                        }
                        // console.log(conn_users)
                    })

            })
    }

    async clearUsersOfDevice(hexId: string, thisUserId: number) {
        console.log("clearUsersOfDevice:", hexId, thisUserId)
        const deviceWithUsers = await this.deviceRepository.findOne({
            where: { hex: hexId },
            include: [
                {model: Users},
            ],
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
        console.log("modifyRoleAccess, uid=", uId, "hex=", devHex, " by req of:", thisUID);

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
}
