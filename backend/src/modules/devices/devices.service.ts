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
}
