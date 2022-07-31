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
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {Users} from "../users/user.entity";
import {PreferenceDto} from "./dto/preference.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {PreferenceService, TPreferenceAction} from "./preference.service";
import {ENDPOINT_PARAM_USER_ID, UserIsUserGuard} from "../../core/guards/UserIsUser.guard";


@Controller('api/user/preference')
export class PreferenceController {
    constructor(private prefService: PreferenceService) {}

    @UseGuards(UserIsUserGuard)
    @Get(`:${ENDPOINT_PARAM_USER_ID}`)
    async getPreferenceByUser(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return this.prefService.getPrefByUserId(Number(userId))
    }

    @UseGuards(UserIsUserGuard)
    @Patch(`:${ENDPOINT_PARAM_USER_ID}`)
    async updateUserPreference(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                               @Body() body: PreferenceDto) {
        console.log(body)
        return this.prefService.updateUserPref(Number(userId), body)
    }

    @UseGuards(UserIsUserGuard)
    @Get(`black_list/:${ENDPOINT_PARAM_USER_ID}`)
    async getBlackList(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return this.prefService.getBlackListByUserId(Number(userId))
    }

    @UseGuards(UserIsUserGuard)
    @Put(`black_list/:${ENDPOINT_PARAM_USER_ID}/:block_id`)
    async appendBlackList(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                          @Param('block_id') uBlockId: number) {
        return this.prefService.modifyBlockList(Number(userId), Number(uBlockId), TPreferenceAction.append)
    }

    @UseGuards(UserIsUserGuard)
    @Delete(`black_list/:${ENDPOINT_PARAM_USER_ID}/:block_id`)
    async removeFromBlackList(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                              @Param('block_id') unblockId: number) {
        return this.prefService.modifyBlockList(Number(userId), Number(unblockId), TPreferenceAction.delete)
    }

    @Post(`avatar/:${ENDPOINT_PARAM_USER_ID}`)
    @UseInterceptors(FileInterceptor('file'))
    async uploadUserAvatar(@Param(ENDPOINT_PARAM_USER_ID) userId: number,
                           @UploadedFile() file: Express.Multer.File) {
        return this.prefService.uploadAvatar(userId, file)
    }

    @Delete(`avatar/:${ENDPOINT_PARAM_USER_ID}`)
    async removeUserAvatar(@Param(ENDPOINT_PARAM_USER_ID) userId: number) {
        return this.prefService.removeAvatarByUserId(userId);
    }
}