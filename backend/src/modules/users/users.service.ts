import {Injectable, Inject} from '@nestjs/common';
import { Users } from './user.entity';
import { USER_REPOSITORY } from '../../core/constants/index1';
import {InjectModel} from "@nestjs/sequelize";
import {Devices} from "../devices/device.entity";
import {UpdateUserInfoDto, UserDto} from "./dto/user.dto";
import {Preference} from "./preference.entity";
import {BlockList} from "net";
import {Blacklist} from "./blacklist.entity";

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
        return await this.deviceRepository.findOne({
            where: {id: deviceId},
            include: [{
                model: Users,
                include: [{
                    model: Preference,
                    attributes: ["profile_photo"]
                }]
            }]
        })
            .then(device => {
                if (!device) return;

                return device.users;
            })
    }

    async deleteUser(user: UserDto): Promise<number> {
        return await this.userRepository.destroy<Users>({ where: { email : user.login } });
    }

    async deleteUserById(userId: number): Promise<number> {
        return await this.userRepository.destroy<Users>({where: { id : userId }})
    }

    async findOneByEmail(email: string): Promise<Users> {
        return await this.userRepository.findOne<Users>({ where: { email } });
    }

    async findOneByLogin(login: string): Promise<Users> {
        return await this.userRepository.findOne<Users>({ where: { login: login } });
    }

    async findOneById(id: number): Promise<Users> {
        return await this.userRepository.findOne<Users>({
            where: { id }, include: [{
                model: Preference,
                include: [Blacklist]
            }]
        });
    }

    async update(userId: number, userDto: UpdateUserInfoDto) {
        await this.findOneById(userId)
            .then(user => {
                // user.setDataValue('name', userDto.name);
                if (userDto.email)
                    user.setDataValue('email', userDto.email);
                if (userDto.full_name)
                    user.setDataValue('full_name', userDto.full_name);
                if (userDto.phone)
                    user.setDataValue('phone', userDto.phone);
                // user.setDataValue('phone', userDto.phone);
                user.save();
                return user;
            })
    }
}