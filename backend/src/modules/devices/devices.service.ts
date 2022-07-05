import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Devices} from "./device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {Users} from "../users/user.entity";
import {RoleValues} from "./dto/roles__dto";

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

        return await this.deviceRepository.findOne({where: {hex: hexId}})
            .then(device => {
                return device.$get("users").then(users => {
                    if(users.length) {
                        console.log("Device already owned")
                    } else {
                        console.log("Device is lonely")
                        return this.usersRepository.findOne({where: {id: thisUserId}})
                            .then(curUser => {
                                return device.$add("users", curUser, {through: {role: "OWNER"}})
                            })
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
}
