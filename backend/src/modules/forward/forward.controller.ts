import {Controller, Get, Header, Param, Res} from '@nestjs/common';
import {ForwardService} from './forward.service';

@Controller('api/tablet')
export class ForwardController {
    constructor(private readonly forwardService: ForwardService) {}

    @Get('forward')
    async getPage() {
        return await this.forwardService.forwardRequest('http://192.168.50.85:3000');
    }

    @Get('forward/:res_folder/:res')
    async getStaticResources(@Param('res_folder') res_folder: string,
                             @Param('res') resource: string,
                             @Res() response) {
        const imageData =
            await this.forwardService.forwardStaticRequest(`http://192.168.50.85:3000/${res_folder}/${resource}`)
        response.send(imageData); // Send image data as Buffer
    }
}