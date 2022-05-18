import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Devices} from "./device.entity";
import {InjectModel} from "@nestjs/sequelize";
import {Create_deviceDto} from "./dto/create_device.dto";
import {Users} from "../users/user.entity";

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                @InjectModel(Users) private readonly  usersRepository: typeof Users) { }

    async create(new_device: Create_deviceDto): Promise<Devices> {
        return await this.deviceRepository.create<Devices>(new_device);
    }

    async bindDeviceWithUser(user_id : number, device_id: number, connect_status: boolean) {
        return await this.usersRepository.findOne({where: {id: user_id}})
            .then(user => {
                if (!user) return new HttpException('Some error', HttpStatus.NOT_FOUND);

                this.deviceRepository.findOne({where: {id: device_id}})
                    .then(device => {
                        if (connect_status) {
                            user.$add('devices', device);
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

    async deleteDeviceById(device_id: number) {
        return await this.deviceRepository.destroy({where: {id: device_id}})
    }
}
