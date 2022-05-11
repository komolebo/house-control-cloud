import {Body, Controller, Delete, Get, Param, Post, Request, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // close API after testing
    @Get('list')
    async getUsersList() {
        return await this.usersService.getUsers();
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return await this.usersService.findOneById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.usersService.deleteUserById(id);
    }
}
