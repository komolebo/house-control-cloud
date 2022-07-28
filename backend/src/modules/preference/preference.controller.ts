import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    Put,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {Users} from "../users/user.entity";
import {PreferenceDto} from "./dto/preference.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {PreferenceService, TPreferenceAction} from "./preference.service";


@Controller('api/user/preference')
export class PreferenceController {
    constructor(private prefService: PreferenceService,
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
        return this.prefService.getPrefByUserId(Number(thisUser.id))
    }

    @Patch()
    async updateUserPreference(@Headers() headers,
                               @Body() body: PreferenceDto) {
        const thisUser: Users = this.parseHeaders(headers);
        console.log(body)
        return this.prefService.updateUserPref(Number(thisUser.id), body)
    }

    @Get('black_list')
    async getBlackList(@Headers() headers) {
        const thisUser: Users = this.parseHeaders(headers);
        return this.prefService.getBlackListByUserId(Number(thisUser.id))
    }

    @Put('black_list/:user_id')
    async appendBlackList(@Headers() headers,
                          @Param('user_id') uBlockId: number) {
        const thisUser: Users = this.parseHeaders(headers);
        console.log(uBlockId, thisUser)
        return this.prefService.modifyBlockList(Number(thisUser.id), Number(uBlockId), TPreferenceAction.append)
    }

    @Delete('black_list/:user_id')
    async removeFromBlackList(@Headers() headers,
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

    @Delete('upload')
    async removeUserAvatar(@Headers() headers) {
        const thisUser: Users = this.parseHeaders(headers);
        return this.prefService.removeAvatarByUserId(thisUser.id);
    }
}