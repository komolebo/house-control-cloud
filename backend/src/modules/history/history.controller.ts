import {Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {HistoryService} from "./history.service";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";
import {UserLoginDto} from "../users/dto/userLoginDto";
import {HistoryRetrieval_Dto} from "./dto/history_dto";

@Controller('api/history')
export class HistoryController {
    constructor(private historyService: HistoryService) {}

    @UseGuards(UserIsUserGuard)
    @Get(`list/:${ENDPOINT_PARAM_USER_ID}`)
    async getHistoryPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.historyService.getHistoryOfUser(Number(userId));
    }

    @UseGuards(UserIsUserGuard)
    @Get(`count/:${ENDPOINT_PARAM_USER_ID}`)
    async getCountHistoryPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.historyService.countHistoryOfUser(Number(userId));
    }

    // @UseGuards(UserIsUserGuard)
    @Post(`:${ENDPOINT_PARAM_USER_ID}`)
    async getFilteredUserHistoryChunk(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                                      @Body() historyRetrievalDto: HistoryRetrieval_Dto) {
        console.log(historyRetrievalDto)
        return await this.historyService.getFilteredHistoryChunk(
            Number(userId),
            historyRetrievalDto
        )
    }

    @UseGuards(UserIsUserGuard)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}`)
    async deleteHistoryList(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                            @Body() body) {
        const keys = body['id'];
        return await this.historyService.deleteHistoryItems(Number(userId), keys)
    }
}
