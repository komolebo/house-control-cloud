import {Body, Controller, Get, Headers, Post} from '@nestjs/common';
import {DevicesService} from "../devices/devices.service";
import {JwtService} from "@nestjs/jwt";
import {Users} from "../users/user.entity";
import {HistoryService} from "./history.service";

@Controller('api/history')
export class HistoryController {
    constructor(private jwtService: JwtService,
                private historyService: HistoryService) {}

    private parseHeaders(headers) {
        const [, token] = headers.authorization.split ("Bearer ")
        const decodeData = this.jwtService.decode(token);
        const thisUser: Users = JSON.parse (JSON.stringify(decodeData));
        return thisUser;
    }

    @Get('list')
    async getDevicesListPerUser(@Headers() headers) {
        const thisUser = this.parseHeaders (headers);
        return await this.historyService.getHistoryOfUser(thisUser.id);
    }
}
