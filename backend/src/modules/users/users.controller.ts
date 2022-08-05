import {Body, Controller, Delete, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UpdateUserInfoDto} from "./dto/user.dto";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";
import {OwnerForDeviceGuard} from "../../core/guards/OwnerForDevice.guard";

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // close API after testing
    @Get('list')
    async getUsersList() {
        return await this.usersService.getUsers();
    }

    @UseGuards(OwnerForDeviceGuard)
    @Get('list/:device_id')
    async getUserListPerDevice(@Param('device_id') deviceHex: string) {
        return await this.usersService.getUsersPerDevice(deviceHex);
    }

    @UseGuards(UserIsUserGuard)
    @Get(`:${ENDPOINT_PARAM_USER_ID}`)
    async getUserFullInfo(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.usersService.getFullUserInfo(Number(userId));
    }

    @UseGuards(UserIsUserGuard)
    @Patch(`:${ENDPOINT_PARAM_USER_ID}`)
    async updateSelfInfo(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                         @Body() body: UpdateUserInfoDto) {
        return await this.usersService.update(Number(userId), body);
    }

    @UseGuards(UserIsUserGuard)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}`)
    async delete(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.usersService.deleteAccountById(Number(userId));
    }
}
