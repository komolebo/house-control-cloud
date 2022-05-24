import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {DevicesService} from "./devices.service";
import {UserDto} from "../users/dto/user.dto";
import {CreateDevice_Dto} from "./dto/create_device__dto";
import {BindDevice_Dto} from "./dto/roles__dto";

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
        return await this.devicesService.bindDeviceWithUser(user_id, device_id, true,
                                                            bindDev_dto.role);
    }

    @Post('unbind/:user_id/:device_id')
    async unbindDeviceForUser(@Param('device_id') device_id: number,
                              @Param('user_id') user_id: number) {
        return await this.devicesService.bindDeviceWithUser(user_id, device_id, false);
    }

    @Get('list')
    async getDevicesList() {
        return await this.devicesService.getDevices();
    }

    @Get('list/:user_id')
    async getDevicesListPerUser(@Param('user_id') user_id: number) {
        return await this.devicesService.getDevicesPerUser(user_id);
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
