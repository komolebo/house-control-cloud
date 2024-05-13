import {Controller, Get, HttpStatus, Logger, Param, Res} from '@nestjs/common';
import {ForwardService} from './forward.service';

@Controller('api/tablet')
export class ForwardController {
    constructor(private readonly forwardService: ForwardService) {}

    private logger = new Logger(ForwardController.name);
    private TABLET_BACKEND_ADDR = `http://192.168.50.85:3000`;

    @Get('forward')
    async getPage() {
        return await this.forwardService.forwardRequest(this.TABLET_BACKEND_ADDR);
    }

    @Get('forward/:res_folder/:res')
    async getStaticResources(@Param('res_folder') res_folder: string,
                             @Param('res') resource: string,
                             @Res() response) {
        try {
            const [imageData, responseHeaders] =
                await this.forwardService.forwardStaticRequest(`${this.TABLET_BACKEND_ADDR}/${res_folder}/${resource}`)

            for (const [key, value] of Object.entries(responseHeaders)) {
                response.set(key, value); // Set header on NestJS response
            }

            response.send(imageData); // Send image data as Buffer
        } catch (error) {
            this.logger.error(`Error fetching static resource '${resource}': `, error)

            response.status(error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
            response.send({ message: 'Resource not found' }); // Or other error response
        }
    }
}