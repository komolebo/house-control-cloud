import {Body, Controller, Delete, Get, Headers, Param, Post, Put, UploadedFile, UseInterceptors} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Users} from "./user.entity";
import {PreferenceService, TPreferenceAction} from "./preference.service";
import {JwtService} from "@nestjs/jwt";
import {PreferenceDto, UploadAvatarDto} from "./dto/preference.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('api/user/preference')
export class PreferenceController {
    constructor(private usersService: UsersService,
                private prefService: PreferenceService,
                private jwtService: JwtService) {}

    private parseHeaders(headers) {
        const [, token] = headers.authorization.split ("Bearer ")
        const decodeData = this.jwtService.decode(token);
        const thisUser: Users = JSON.parse (JSON.stringify(decodeData));
        return thisUser;
    }

    @Get()
    async getPreferenceByUser(@Headers() headers) {
        const thisUser: Users = this.parseHeaders(headers);
        return this.prefService.getPrefByUser(Number(thisUser.id))
    }

    @Post()
    async updateUserPreference(@Headers() headers,
                               @Body() body: PreferenceDto) {
        const thisUser: Users = this.parseHeaders(headers);
        return this.prefService.updateUserPref(Number(thisUser.id), body)
    }

    @Put(':user_id')
    async appendBlockList(@Headers() headers,
                          @Param('user_id') uBlockId: number) {
        const thisUser: Users = this.parseHeaders(headers);
        console.log(uBlockId, thisUser)
        return this.prefService.modifyBlockList(Number(thisUser.id), Number(uBlockId), TPreferenceAction.append)
    }

    @Delete(':user_id')
    async removeFromBlockList(@Headers() headers,
                              @Param('user_id') unblockId: number) {
        const thisUser: Users = this.parseHeaders(headers);
        return this.prefService.modifyBlockList(Number(thisUser.id), Number(unblockId), TPreferenceAction.delete)
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadUserAvatar(@Headers() headers,
                           @UploadedFile() file: Express.Multer.File) {
        const thisUser: Users = this.parseHeaders(headers);
        return this.prefService.uploadAvatar(thisUser.id, file)
    }
}