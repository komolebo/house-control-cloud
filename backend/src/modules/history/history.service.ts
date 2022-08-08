import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {Histories} from "./history.entity";
import {CreateHistoryItem_Dto} from "./dto/history_dto";

@Injectable()
export class HistoryService {
    constructor(@InjectModel(Histories) private readonly historyRepository: typeof Histories,
                @InjectModel(Users) private readonly userRepository: typeof Users) {}

    async getHistoryOfUser(userId: number) {
        const user = await this.userRepository.findOne({
            where: {id: userId}, include: {model: Histories}}
        )
        return user.get("history")
    }

    async countHistoryOfUser(userId: number) {
        return await this.userRepository.count ({
                where: {id: userId},
                include: {model: Histories}
            }
        )
    }

    async getPagedHistoryOfUser(uId: number, offset: number, limit: number) {
        const user = await this.userRepository.findByPk(uId);
        return user.$get('history', {
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC'],
            ]
        })
    }

    async createHistoryItem(userId: number, createHistoryDto: CreateHistoryItem_Dto) {
        const user = await this.userRepository.findOne({
            where: {id: userId}, include: {model: Histories}}
        )

        const historyItem = await this.historyRepository.create<Histories>(createHistoryDto);
        return await user.$add("history", historyItem);
    }

    async deleteHistoryItems(userId: number, rawDelArr: Array<number>) {
        if (!rawDelArr.length) return;

        const user = await this.userRepository.findOne({
            where: {id: userId},
            include: [Histories]
        })

        // verify all the IDs belong to userId
        let delArr = []
        rawDelArr.forEach(delId => {
            if (user.history.find(hItem => hItem.id === delId)) {
                delArr.push(delId)
            }
        })

        return await this.historyRepository.destroy({ where: {id: delArr }})
    }
}
