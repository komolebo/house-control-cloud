import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {DevicesService} from "./devices.service";
import {UserDto} from "../users/dto/user.dto";
import {Create_deviceDto} from "./dto/create_device.dto";

@Controller('devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) {}

    @Post('add')
    async addDevice(@Body() device: Create_deviceDto) {
        return await this.devicesService.create(device);
    }

    @Post('bind/:user_id/:device_id')
    async bindDeviceForUser(@Param('device_id') device_id: number,
                            @Param('user_id') user_id: number) {
        return await this.devicesService.bindDeviceWithUser(user_id, device_id, true);
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

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.devicesService.deleteDeviceById(id);
    }


}
