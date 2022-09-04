import {Body, Controller, Get} from '@nestjs/common';
import {DeliveriesService} from "./deliveries.service";
import {CurSysVersionDto, SysVerArrDto} from "./dto/types";

@Controller('api/release')
export class DeliveriesController {
    constructor(private deliveryService: DeliveriesService) {}

    @Get('link')
    async getFtpLink() {
        return this.deliveryService.FTP_LINK;
    }

    @Get('latest')
    async getLatestSysVersion() {
        return this.deliveryService.getLatestSysVersion();
    }

    @Get('sequence')
    async getFlashSequence(@Body() curVersionDto: CurSysVersionDto) {
        return this.deliveryService.getFlashSequenceFromSysVer(curVersionDto.sysVersion)
    }

    @Get('subcomponents')
    async getComponentsVersion(@Body() sysVerArrDto: SysVerArrDto) {
        return this.deliveryService.getComponentsVersionBySysVer(sysVerArrDto.sysVerArr);
    }
}
