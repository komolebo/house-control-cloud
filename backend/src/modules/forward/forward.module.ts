import {Module} from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import {ForwardController} from "./forward.controller";
import {ForwardService} from "./forward.service";

@Module ({
    controllers: [ForwardController],
    providers: [ForwardService],
    exports: [ForwardService],
    imports: [HttpModule]
})
export class ForwardModule {}
