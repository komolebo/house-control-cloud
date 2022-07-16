import { Injectable } from '@nestjs/common';
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

    async createHistoryItem(userId: number, createHistoryDto: CreateHistoryItem_Dto) {
        const user = await this.userRepository.findOne({
            where: {id: userId}, include: {model: Histories}}
        )

        const historyItem = await this.historyRepository.create<Histories>(createHistoryDto);
        return await user.$add("history", historyItem);
    }
}
