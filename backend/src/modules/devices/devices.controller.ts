import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {DevicesService} from "./devices.service";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {BindDevice_Dto, RoleValues} from "./dto/roles__dto";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";
import {ENDPOINT_PARAM_DEVICE_ID, OwnerForDeviceGuard} from "../../core/guards/OwnerForDevice.guard";
import {DispatchPreInterceptor} from "../../core/interceptors/dispatch-pre-interceptor.service";
import {DispatchPostInterceptor} from "../../core/interceptors/dispatch-post-interceptor.service";


@Controller('api/devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) {}

    @Post('add')
    async addDevice(@Body() device: CreateDevice_Dto) {
        return await this.devicesService.create(device);
    }

    @Post('bind/:user_id/:device_id')
    async bindDeviceForUser(@Param('device_id') device_id: number,
                            @Param('user_id') user_id: number,
                            @Body() bindDev_dto: BindDevice_Dto) {
        return await this.devicesService.bindDeviceWithUser(Number(user_id), Number(device_id), bindDev_dto.role);
    }

    @Post('unbind/:user_id/:device_id')
    async unbindDeviceForUser(@Param('device_id') device_id: number,
                              @Param('user_id') user_id: number) {
        return await this.devicesService.unbindDeviceFromUser(Number(user_id), Number(device_id));
    }

    @UseGuards(UserIsUserGuard)
    @UseInterceptors(DispatchPostInterceptor)
    @Post(`access/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}/:role`)
    async reqAccessToDevice(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                            @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                            @Param('role') role: string) {
        return this.devicesService.accessDeviceByHex(devHex, Number(userId), role)
    }

    @UseGuards(UserIsUserGuard)
    @UseInterceptors(DispatchPreInterceptor)
    @Post(`forget/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}`)
    async reqUnsubscribeFromDevice(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                                   @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string) {
        return this.devicesService.unsubscribeFromDeviceByHex(devHex, Number(userId))
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @UseInterceptors(DispatchPreInterceptor)
    @Post(`reset/:${ENDPOINT_PARAM_USER_ID}/:${ENDPOINT_PARAM_DEVICE_ID}`)
    async reqClearDeviceUsers(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                              @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string) {
        return this.devicesService.clearUsersOfDevice(devHex, Number(userId))
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @UseInterceptors(DispatchPreInterceptor)
    @Post(`modify/:${ENDPOINT_PARAM_USER_ID}/:${ENDPOINT_PARAM_DEVICE_ID}/:obj_user_id/:role`)
    async reqModifyAccess(@Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                          @Param(ENDPOINT_PARAM_USER_ID) userId: number,
                          @Param('obj_user_id') objUserId: number,
                          @Param('role') role: RoleValues) {
        return this.devicesService.modifyRoleAccess(Number(objUserId), Number(userId), devHex, role);
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @UseInterceptors(DispatchPreInterceptor)
    @Delete(`:${ENDPOINT_PARAM_USER_ID}/:${ENDPOINT_PARAM_DEVICE_ID}/:obj_user_id`)
    async reqRemoveAccess(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                          @Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                          @Param('obj_user_id') objUserId: number) {
        return this.devicesService.removeRole(Number(objUserId), Number(userId), devHex);
    }

    @UseGuards(UserIsUserGuard)
    @UseGuards(OwnerForDeviceGuard)
    @UseInterceptors(DispatchPostInterceptor)
    @Post(`invite/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}/:login/:role`)
    async reqInviteUser(@Param(ENDPOINT_PARAM_DEVICE_ID) devHex: string,
                        @Param(ENDPOINT_PARAM_USER_ID) userId: number,
                        @Param('login') userLogin: string,
                        @Param('role') role: string) {
        return this.devicesService.inviteUser(userLogin, Number(userId), devHex, role);
    }

    @UseGuards(UserIsUserGuard)
    @Get(`list/:${ENDPOINT_PARAM_USER_ID}`)
    async getDevicesListPerUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return await this.devicesService.getDevicesPerUser(Number(userId));
    }

    @UseGuards(UserIsUserGuard)
    @UseInterceptors(DispatchPostInterceptor)
    @Patch(`alias/:${ENDPOINT_PARAM_DEVICE_ID}/:${ENDPOINT_PARAM_USER_ID}/:alias`)
    async updateDeviceAlias(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                            @Param(ENDPOINT_PARAM_DEVICE_ID) deviceId: string,
                            @Param("alias") alias: string) {
        return await this.devicesService.updateDeviceAlias(Number(userId), deviceId, alias)
    }
}
