import {Body, Controller, Delete, Get, Headers, Param, Post, Put} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserDto} from "./dto/user.dto";
import {JwtService} from "@nestjs/jwt";
import {Users} from "./user.entity";

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService,
                private jwtService: JwtService) {}

    private parseHeaders(headers) {
        const [, token] = headers.authorization.split ("Bearer ")
        const decodeData = this.jwtService.decode(token);
        const thisUser: Users = JSON.parse (JSON.stringify(decodeData));
        return thisUser;
    }

    // close API after testing
    @Get('list')
    async getUsersList() {
        return await this.usersService.getUsers();
    }

    @Get('list/:device_id')
    async getUserListPerDevice(@Param('device_id') device_id: number) {
        return await this.usersService.getUsersPerDevice(device_id);
    }

    // @Get(':id')
    // async getUser(@Param('id') id: number) {
    //     return await this.usersService.findOneById(id);
    // }

    @Get('me')
    async getSelfFullInfo(@Headers() headers) {
        const thisUser = this.parseHeaders (headers);
        return await this.usersService.findOneById(thisUser.id);
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
