import {Body, Controller, Delete, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UpdateUserInfoDto} from "./dto/user.dto";
import {ENDPOINT_PARAM_USER_ID, UserIsUser} from "../../core/guards/UserIsUser";

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // close API after testing
    @Get('list')
    async getUsersList() {
        return await this.usersService.getUsers();
    }

    // @UseGuards(UserIsUser)
    @Get('list/:device_id')
    async getUserListPerDevice(@Param('device_id') device_id: number) {
        return await this.usersService.getUsersPerDevice(device_id);
    }

    @UseGuards(UserIsUser)
    @Get(`:${ENDPOINT_PARAM_USER_ID}`)
    async getUserFullInfo(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.usersService.findOneById(Number(userId));
    }

    @UseGuards(UserIsUser)
    @Patch(`:${ENDPOINT_PARAM_USER_ID}`)
    async updateSelfInfo(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                         @Body() body: UpdateUserInfoDto) {
        return await this.usersService.update(Number(userId), body);
    }

    @UseGuards(UserIsUser)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}`)
    async delete(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.usersService.deleteAccountById(Number(userId));
    }
}
