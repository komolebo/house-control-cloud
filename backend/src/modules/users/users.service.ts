import {Injectable, Inject} from '@nestjs/common';
import { Users } from './user.entity';
import { USER_REPOSITORY } from '../../core/constants/index1';
import {InjectModel} from "@nestjs/sequelize";
import {Devices} from "../devices/device.entity";
import {UpdateUserInfoDto, UserDto} from "./dto/user.dto";
import {Preference} from "../preference/preference.entity";
import {Blacklist} from "../preference/blacklist.entity";
import {PreferenceService} from "../preference/preference.service";
import {DevicesService} from "../devices/devices.service";

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof Users,
                @InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                private readonly prefService: PreferenceService,
                private readonly devService: DevicesService) { }

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

    async deleteAccountById(userId: number) {
        // TODO: rework
        const curUser = await Users.findOne({
            where: {id: userId},
            include: [{
                model: Preference
            }, {
                model: Devices,
                include: [Users]
            }]
        })
        if (!curUser) return

        // remove avatar
        if (curUser.preference) {
            const profileId = curUser.preference.profile_photo_id;
            if (profileId) {
                await this.prefService.removeImageFromCloudinary(profileId);
            }
        }

        // check if there are devices which have this user as the only owner
        curUser.devices && curUser.devices.forEach(dev => {
            const isOwner = this.devService.isUserAnOwner(curUser.id, dev);
            const theOnlyOwner = this.devService.calcOwnersPerDevice(dev) === 1

            // delete all users per this device
            if (isOwner && theOnlyOwner) {
                dev.$remove("users", dev.users)
            }
        })
        await curUser.destroy()

        return curUser
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