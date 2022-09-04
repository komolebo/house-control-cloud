import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Releases} from "./releases.entity";

@Module({
  providers: [DeliveriesService],
  controllers: [DeliveriesController],
  imports: [
    SequelizeModule.forFeature ([Releases]),
  ]
})
export class DeliveriesModule {}
