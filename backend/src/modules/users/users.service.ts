import {Injectable, Inject, HttpException, HttpStatus} from '@nestjs/common';
import { Users } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants/index1';
import {isNumber} from "class-validator";
import {InjectModel} from "@nestjs/sequelize";
import {Devices} from "../devices/device.entity";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof Users,
                @InjectModel(Devices) private readonly deviceRepository: typeof Devices) { }

    async create(user: UserDto): Promise<Users> {
        return await this.userRepository.create<Users>(user);
    }

    async getUsers(): Promise<Users[]> {
        return await this.userRepository.findAll();
    }

    async getUsersPerDevice(deviceId: number) {
        return await this.deviceRepository.findOne({where: {id: deviceId}})
            .then(device => {
                if (!device) return;

                return device.$get('users');
            })
    }

    async deleteUser(user: UserDto): Promise<number> {
        return await this.userRepository.destroy<Users>({ where: { email : user.email } });
    }

    async deleteUserById(userId: number): Promise<number> {
        return await this.userRepository.destroy<Users>({where: { id : userId }})
    }

    async findOneByEmail(email: string): Promise<Users> {
        return await this.userRepository.findOne<Users>({ where: { email } });
    }

    async findOneById(id: number): Promise<Users> {
        return await this.userRepository.findOne<Users>({ where: { id } });
    }

    async update(userDto: UserDto) {
        await this.findOneByEmail(userDto.email)
            .then(user => {
                user.setDataValue('name', userDto.name);
                user.setDataValue('email', userDto.email);
                user.setDataValue('phone', userDto.phone);
                user.save();
                return user;
            })
    }
}