import {Injectable, Logger} from '@nestjs/common';
import {AxiosResponse, RawAxiosResponseHeaders} from "axios";
import {HttpService} from '@nestjs/axios';

@Injectable()
export class ForwardService {
    constructor(private readonly httpService: HttpService) {}

    private logger = new Logger(ForwardService.name);

    async forwardRequest(url: string, data?: any): Promise<AxiosResponse> {
        this.logger.log(`Processing forward request to'${url}'`)

        const response = await this.httpService.get(url, data).toPromise();
        return response.data;
    }

    async forwardStaticRequest(url: string, data?: any): Promise<[AxiosResponse, RawAxiosResponseHeaders]> {
        this.logger.log(`Processing forward request to static '${url}'`)

        const response = await this.httpService.get(url, {
                responseType: 'arraybuffer'
            }).toPromise()

        return [response.data, response.headers]
    }
}
