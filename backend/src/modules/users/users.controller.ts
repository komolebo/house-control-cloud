import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserDto} from "./dto/user.dto";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // close API after testing
    @Get('list')
    async getUsersList() {
        return await this.usersService.getUsers();
    }

    @Get('list/:device_id')
    async getUserListPerDevice(@Param('device_id') device_id: number) {
        return await this.usersService.getUsersPerDevice(device_id);
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return await this.usersService.findOneById(id);
    }

    @Put(':id')
    async updateUser(@Body() user: UserDto) {
        return await this.usersService.update(user);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.usersService.deleteUserById(id);
    }
}
