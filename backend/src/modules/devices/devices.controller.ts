import {Body, Controller, Delete, Get, Logger, Param, Post, Req, UseGuards} from '@nestjs/common';
import {DevicesService} from "./devices.service";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {BindDevice_Dto, RoleValues} from "./dto/roles__dto";
import { Headers } from '@nestjs/common';
import {Users} from "../users/user.entity";
import {JwtService} from "@nestjs/jwt";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";
import {ENDPOINT_PARAM_DEVICE_ID, OwnerForDeviceGuard} from "../../core/guards/OwnerForDevice.guard";


@Controller('api/devices')
export class DevicesController {
    constructor(private devicesService: DevicesService,
                private jwtService: JwtService) {}

    private parseHeaders(headers) {
        const [, token] = headers.authorization.split ("Bearer ")
        const decodeData = this.jwtService.decode(token);
        const thisUser: Users = JSON.parse (JSON.stringify(decodeData));
        return thisUser;
    }

    @Post('add')
    async addDevice(@Body() device: CreateDevice_Dto) {
        return await this.devicesService.create(device);
    }

    @Post('bind/:user_id/:device_id')
    async bindDeviceForUser(@Param('device_id') device_id: number,
                            @Param('user_id') user_id: number,
                            @Body() bindDev_dto: BindDevice_Dto) {
        return await this.devicesService.bindDeviceWithUser(user_id, device_id, true,
                                                            bindDev_dto.role);
    }

    @Post('unbind/:user_id/:device_id')
    async unbindDeviceForUser(@Param('device_id') device_id: number,
                              @Param('user_id') user_id: number) {
        return await this.devicesService.bindDeviceWithUser(user_id, device_id, false);
    }

    // @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @Post(`access/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}/:role`)
    async reqAccessToDevice(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                            @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                            @Param('role') role: string) {
        return this.devicesService.accessDeviceByHex(devHex, userId, role)
        // return {res: "good"}
    }

    @UseGuards(UserIsUserGuard)
    @Post(`forget/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}`)
    async reqUnsubscribeFromDevice(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                                   @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string) {
        return this.devicesService.unsubscribeFromDeviceByHex(devHex, userId)
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @Post(`reset/:${ENDPOINT_PARAM_DEVICE_ID}`)
    async reqClearDeviceUsers(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                              @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string) {
        return this.devicesService.clearUsersOfDevice(devHex, userId)
    }

    @Post(`modify/:${ENDPOINT_PARAM_USER_ID}/:${ENDPOINT_PARAM_DEVICE_ID}/:obj_user_id/:role`)
    async reqModifyAccess(@Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                          @Param(ENDPOINT_PARAM_USER_ID) userId: number,
                          @Param('obj_user_id') objUserId: number,
                          @Param('role') role: RoleValues) {
        return this.devicesService.modifyRoleAccess(objUserId, Number(userId), devHex, role);
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}/:${ENDPOINT_PARAM_DEVICE_ID}/:obj_user_id`)
    async reqRemoveAccess(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                          @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                          @Param('obj_user_id') objUserId: number) {
        return this.devicesService.removeRole(Number(objUserId), Number(userId), devHex);
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @Post(`invite/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}/:login/:role`)
    async reqInviteUser(@Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                        @Param(ENDPOINT_PARAM_USER_ID) userId: number,
                        @Param('login') userLogin: string,
                        @Param('role') role: string) {
        return this.devicesService.inviteUser(userLogin, userId, devHex, role);
    }

    @UseGuards(UserIsUserGuard)
    @Get(`list/:${ENDPOINT_PARAM_USER_ID}`)
    async getDevicesListPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.devicesService.getDevicesPerUser(userId);
    }

    @Get('role/:user_id/:device_id')
    async getRoleByUserDevice(@Param('device_id') device_id: number,
                              @Param('user_id') user_id: number) {
        return await this.devicesService.getRoleByUserAndDevice(user_id, device_id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.devicesService.deleteDeviceById(id);
    }


}
