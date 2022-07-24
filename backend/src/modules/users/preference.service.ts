import {Injectable} from "@nestjs/common";
import {Users} from "./user.entity";
import {InjectModel} from "@nestjs/sequelize";
import {Preference} from "./preference.entity";
import {Blacklist} from "./blacklist.entity";
import {UsersService} from "./users.service";
import {createEvalAwarePartialHost} from "ts-node/dist/repl";
import {forEachResolvedProjectReference} from "ts-loader/dist/instances";
import {PreferenceDto} from "./dto/preference.dto";

export enum TPreferenceAction {
    delete,
    append = 1,
}


@Injectable()
export class PreferenceService {
    constructor(@InjectModel (Preference) private readonly prefRepository: typeof Preference,
                @InjectModel (Users) private readonly userRepository: typeof Users,
                private readonly usersService: UsersService) {}

    async createDefault(user: Users) {
        const newPref = await this.prefRepository.create()
        await user.$set('preference', newPref)
    }

    async getPrefByUser(userId: number) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Preference]
        })

        if (!user) return;
        if (!user.preference) {  // create default
            await this.createDefault(user)
        }

        const black_list = await user.preference.$get("black_list")
            .then(res => {
               return res.map(bl_item => bl_item.blockUserId)
            })
        const result = await this.userRepository.findAll({where: {id: black_list}})
            .then(users => {
                return users.map(u => {return {
                    "name": u.full_name,
                    "login": u.login,
                    "id": u.id
                }})
            })

        return {"prefs": user.preference, "black_list": result}
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
        await user.preference.save()
        return user.preference
    }

    async modifyBlockList(userId: number, blockedUserId: number, action: TPreferenceAction) {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Preference]
        })
        const blockUser = await this.usersService.findOneById(blockedUserId)

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
}