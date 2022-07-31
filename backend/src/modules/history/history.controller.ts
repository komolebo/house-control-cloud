import {Body, Controller, Delete, Get, Param, UseGuards} from '@nestjs/common';
import {HistoryService} from "./history.service";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";

@Controller('api/history')
export class HistoryController {
    constructor(private historyService: HistoryService) {}

    @UseGuards(UserIsUserGuard)
    @Get(`list/:${ENDPOINT_PARAM_USER_ID}`)
    async getHistoryPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.historyService.getHistoryOfUser(Number(userId));
    }

    @UseGuards(UserIsUserGuard)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}`)
    async deleteHistoryList(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                            @Body() body) {
        const keys = body['id'];
        return await this.historyService.deleteHistoryItems(Number(userId), keys)
    }
}
