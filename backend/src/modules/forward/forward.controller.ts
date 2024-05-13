import {Controller, Get, Param, Res} from '@nestjs/common';
import {ForwardService} from './forward.service';

@Controller('api/tablet')
export class ForwardController {
    constructor(private readonly forwardService: ForwardService) {}

    TABLET_BACKEND_ADDR = `http://192.168.50.85:3000`;

    @Get('forward')
    async getPage() {
        return await this.forwardService.forwardRequest(this.TABLET_BACKEND_ADDR);
    }

    @Get('forward/:res_folder/:res')
    async getStaticResources(@Param('res_folder') res_folder: string,
                             @Param('res') resource: string,
                             @Res() response) {
        const [imageData, responseHeaders] =
            await this.forwardService.forwardStaticRequest(`${this.TABLET_BACKEND_ADDR}/${res_folder}/${resource}`)

        for (const [key, value] of Object.entries(responseHeaders)) {
            response.set(key, value); // Set header on NestJS response
        }

        response.send(imageData); // Send image data as Buffer
    }
}