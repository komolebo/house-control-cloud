import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {Histories} from "./history.entity";
import {CreateHistoryItem_Dto, HistoryRetrieval_Dto, THistoryMsgType} from "./dto/history_dto";
import sequelize, {Op} from "sequelize";
import * as moment from "moment";

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

    async getFilteredHistoryChunk(userId: number, queryParam: HistoryRetrieval_Dto) {
        const user = await this.userRepository.findByPk(userId);
        if (!user) return new HttpException("User not found", HttpStatus.NOT_FOUND);

        // undefined params -> do not filter
        const from = queryParam.from ? moment(queryParam.from).toDate() : null;
        const to = queryParam.to ? moment(queryParam.to).toDate() : null;

        // type 'None' -> do not filter
        const type = queryParam.type === THistoryMsgType.None ? null : queryParam.type;

        return user.$get('history', {
            offset: queryParam.offset,
            limit: queryParam.limit,
            order: [
                ['id', 'DESC']
            ],
            where: {
                [Op.and]: [
                    type ? {type: type} : {},
                    queryParam.text ? {
                            text: sequelize.where(sequelize.fn(
                                    'LOWER',
                                    sequelize.col('text')),
                                'LIKE',
                                '%' + queryParam.text.toLowerCase() + '%'
                            )
                    } : {},

                    {
                        createdAt: {
                            [from ? Op.gte : Op.ne]: from,
                            [to ? Op.lte : Op.ne]: to
                        },
                    },
                    queryParam.uId ? {
                        uId: queryParam.uId
                    } : {},
                    queryParam.devId ? {
                        devId: queryParam.devId
                    } : {}
                ]
            },
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
