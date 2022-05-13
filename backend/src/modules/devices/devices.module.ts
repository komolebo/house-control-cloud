import {Module} from "@nestjs/common";
import { DevicesService } from './devices.service';
import {DevicesController} from "./devices.controller";

@Module({
  providers: [DevicesService],
  exports: [DevicesModule],
  controllers: [DevicesController]
})
export class DevicesModule {}
