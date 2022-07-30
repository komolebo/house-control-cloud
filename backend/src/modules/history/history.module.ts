import {forwardRef, Module} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import {UsersModule} from "../users/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {Histories} from "./history.entity";
import {DatabaseModule} from "../../core/database/database.module";
import {AuthModule} from "../auth/auth.module";

@Module ({
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
        DatabaseModule,
        SequelizeModule.forFeature ([Users, Histories]),
    ]
})
export class HistoryModule {
}
