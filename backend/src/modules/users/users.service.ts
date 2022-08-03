import {Injectable, Inject} from '@nestjs/common';
import { Users } from './user.entity';
import { USER_REPOSITORY } from '../../core/globals/db_constants';
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

    async getFullUserInfo(id: number): Promise<Users> {
        return await this.userRepository.findOne<Users>({
            where: { id }, include: [{
                model: Preference,
                include: [Blacklist]
            }]
        });
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

    async deleteAccountById(userId: number) {
        const curUser = await Users.findOne({
            where: {id: userId},
            include: [
                {
                    model: Preference
                },
                {
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
        for (const dev of curUser.devices) {
            const isOwner = this.devService._isUserAnOwner(curUser.id, dev);
            const theOnlyOwner = await this.devService._calcOwnerPerDevice(dev) === 1

            // delete all users per this device
            if (isOwner && theOnlyOwner) {
                await dev.$remove("users", dev.users)
            }
        }
        await curUser.destroy()

        return curUser
    }


    async update(userId: number, userDto: UpdateUserInfoDto) {
        const user = await this.userRepository.findByPk(userId)

        if (userDto.email)
            user.setDataValue('email', userDto.email);
        if (userDto.full_name)
            user.setDataValue('full_name', userDto.full_name);
        if (userDto.phone)
            user.setDataValue('phone', userDto.phone);
        await user.save();

        return user;
    }
}