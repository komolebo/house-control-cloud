import {forwardRef, Module} from "@nestjs/common";
import {DevicesService} from './devices.service';
import {DevicesController} from "./devices.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Devices} from "./device.entity";
import {Roles} from "./role.entity";
import {Users} from "../users/user.entity";
import {DatabaseModule} from "../../core/database/database.module";
import {PassportModule} from "@nestjs/passport";
import {NotificationModule} from "../notification/notification.module";
import {AuthModule} from "../auth/auth.module";
import {SocketModule} from "../../sockets/socket.module";
import {UsersModule} from "../users/users.module";
import {HistoryModule} from "../history/history.module";

@Module ({
    controllers: [DevicesController],
    providers: [DevicesService],
    exports: [DevicesService],
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
        NotificationModule,
        HistoryModule,
        PassportModule,
        DatabaseModule,
        SequelizeModule.forFeature ([Devices, Users, Roles]),
        SocketModule
    ]
})

export class DevicesModule {}
