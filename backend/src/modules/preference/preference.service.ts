import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Preference} from "./preference.entity";
import {Users} from "../users/user.entity";
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {PreferenceDto} from "./dto/preference.dto";
import {Blacklist} from "./blacklist.entity";

export enum TPreferenceAction {
    delete,
    append = 1,
}

@Injectable()
export class PreferenceService {
    constructor(@InjectModel (Preference) private readonly prefRepository: typeof Preference,
                @InjectModel (Users) private readonly userRepository: typeof Users,
                private cloudinary: CloudinaryService) {}

    async createDefault(user: Users) {
        const newPref = await this.prefRepository.create()
        await user.$set('preference', newPref)
    }

    async getPrefByUserId(userId: number) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Preference]
        })

        if (!user) return;
        if (!user.preference) {  // create default
            await this.createDefault(user)
        }
        return user
    }

    async getBlackListByUserId(userId: number) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Preference]
        })

        if (!user || !user.preference) return

        return this.getBlackListOfUser(user)
    }

    private async getBlackListOfUser(user: Users) {
        const blackListIdList = await user.preference.$get ("black_list")
            .then (res => {
                return res.map (bl_item => bl_item.blockUserId)
            })
        return await this.userRepository.findAll ({
            where: {id: blackListIdList},
            include: [Preference]
        })
            .then (users => {

                return users.map (u => {
                    return {
                        "name": u.full_name,
                        "login": u.login,
                        "id": u.id,
                        "urlPic": u.preference ? u.preference.profile_photo : ""
                    }
                })
            });
    }

    async updateUserPref(userId: number, prefDto: PreferenceDto) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Preference]
        })
        if (!user) return;
        if (!user.preference) {  // create default
            await this.createDefault(user)
        }

        if (prefDto.phone_verified !== undefined)
            user.preference.setDataValue("phone_verified", prefDto.phone_verified)
        if (prefDto.email_verified !== undefined)
            user.preference.setDataValue("email_verified", prefDto.email_verified)
        if (prefDto.dark_mode !== undefined)
            user.preference.setDataValue("dark_mode", prefDto.dark_mode)
        if (prefDto.profile_photo !== undefined)
            user.preference.setDataValue("profile_photo", prefDto.profile_photo)
        if (prefDto.profile_photo_id !== undefined)
            user.preference.setDataValue("profile_photo_id", prefDto.profile_photo_id)
        await user.preference.save()
        return user.preference
    }

    async modifyBlockList(userId: number, blockedUserId: number, action: TPreferenceAction) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Preference]
        })
        const blockUser = await this.userRepository.findOne({where: {id: blockedUserId}})

        if (!user || !blockUser) return;
        if (!user.preference) {  // create default
            await this.createDefault(user)
        }

        return this.prefRepository.findOne ({
            where: {id: user.preference.id}, include: [Blacklist]
        })
            .then (preference => {
                if(action === TPreferenceAction.append) {
                    return this.appendBlockList (preference, blockedUserId);
                } else if (action === TPreferenceAction.delete) {
                    return this.removeFromBlockList(preference, blockedUserId)
                }
            })
    }

    private appendBlockList(preference: Preference, blockedUserId: number) {
        const duplicate = preference.black_list.find (blItem => blItem.prefId === preference.id &&
            blItem.blockUserId === Number(blockedUserId))

        if (!duplicate) {
            return Blacklist.create ({
                prefId: preference.id,
                blockUserId: blockedUserId
            }).then (newBlItem => {
                preference.black_list.push (newBlItem)
                return preference
            })
        }
    }
    private async removeFromBlockList(preference: Preference, unblockUserId: number) {
        let blList = preference.get("black_list");

        if (blList.find(el => el.blockUserId === unblockUserId)) {
            await Blacklist.destroy({ where: {prefId: preference.id, blockUserId: unblockUserId} })
        }
        return preference
    }

    async clearBlockList(prefId: number) {
        const preference = await Preference.findOne({
            where: {id: prefId}, include: [Blacklist]
        })

        if (!preference) return;

        const blacklist_Ids = preference.black_list.map(el => el.blockUserId)
        await Blacklist.destroy({ where: {blockUserId: blacklist_Ids} })
        return preference
    }

    async uploadAvatar(userId: number, file: Express.Multer.File) {
        const curUser = await this.userRepository.findOne({
            where: {id: userId}, include: [Preference]
        })

        if (!curUser) return;
        if (!curUser.preference) {  // create default
            await this.createDefault(curUser)
        }

        const photo_profile_id = curUser.preference.profile_photo_id;

        console.log("Uploading ", file)
        const result = await this.uploadImageToCloudinary(file, "avatars", photo_profile_id)

        // verify response
        if (result.public_id && result.url) {
            await this.updateUserPref(userId, {
                profile_photo_id: result.public_id, profile_photo: result.url
            })
        }
        return result
    }

    async removeAvatarByUserId(userId: number) {
        const curUser = await this.userRepository.findOne({
            where: {id: userId}, include: [Preference]
        })

        if (!curUser) return;
        if (!curUser.preference) {
            await this.createDefault(curUser);
        }

        const photo_profile_id = curUser.preference.profile_photo_id;

        const result = await this.removeImageFromCloudinary(photo_profile_id);
        if (result) {
            await this.updateUserPref(userId, {
                profile_photo_id: null, profile_photo: null
            })
        }
        return result;
    }

    private async uploadImageToCloudinary(file: Express.Multer.File, folder: string, profile_id: string | null) {
        return await this.cloudinary.uploadImage(file, folder, profile_id).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
    }
    async removeImageFromCloudinary(profile_id: string | null) {
        return await this.cloudinary.removeImage (profile_id);
    }
}