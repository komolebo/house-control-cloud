import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
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
            include: [
                {
                    model: Preference,
                    include: [{
                        model: Blacklist
                    }]
                }
            ]
        })

        if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        if(!user.preference || !user.preference.black_list) return {}

        const blackIdList = user.preference.black_list.map(el => el.blockUserId)
        const blackListFullInfo = await this.userRepository.findAll ({
            where: {id: blackIdList},
            include: [Preference]
        })

        return blackListFullInfo.map (u => ({
            "name": u.full_name,
            "login": u.login,
            "id": u.id,
            "urlPic": u.preference ? u.preference.profile_photo : ""
        }))
    }

    async isUserIdBlockedByUserId(thisUID: number, objUserId: number) {
        const thisUser = await Users.findByPk(thisUID, {
            include: [{
                model: Preference,
                include: [Blacklist]
            }]
        })
        if (!thisUser) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

        return this.isUIdInBlackList(thisUser.preference.black_list, objUserId);
    }

    private async isUIdInBlackList(blackList: Blacklist[], objUserId: number) {
        return blackList.find(el => el.blockUserId === objUserId) !== undefined
    }

    async putUIdToBlackList(thisUID: number, objUserId: number) {
        const user = await this.userRepository.findByPk(thisUID, {
            include: [{
                model: Preference,
                include: [Blacklist]
            }]
        })
        if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

        if (!await this.isUIdInBlackList(user.preference.black_list, objUserId)) {
            const blackListItem = await Blacklist.create({
                blockUserId: objUserId,
                prefId: user.preference.id
            })
            await user.preference.$add("black_list", blackListItem)
        }
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

        const preference = await this.prefRepository.findOne ({
            where: {id: user.preference.id},
            include: [Blacklist]
        })

        if(action === TPreferenceAction.append) {
            return this.appendBlockList (preference, blockedUserId);
        } else if (action === TPreferenceAction.delete) {
            return this.removeFromBlockList(preference, blockedUserId)
        }
        return new HttpException("Preference action undefined", HttpStatus.NOT_MODIFIED)
    }

    private appendBlockList(preference: Preference, blockedUserId: number) {
        const alreadyPresent = preference.black_list.find (blItem => blItem.blockUserId === Number(blockedUserId))
        //blItem => blItem.prefId === preference.id

        if (alreadyPresent) throw new HttpException("User is already blocked", HttpStatus.NOT_MODIFIED)

        return Blacklist.create ({
            prefId: preference.id,
            blockUserId: blockedUserId
        }).then (newBlItem => {
            preference.black_list.push (newBlItem)
            return preference
        })
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
        const noUploadedAvatar = profile_id === null;
        return noUploadedAvatar || await this.cloudinary.removeImage (profile_id);
    }
}