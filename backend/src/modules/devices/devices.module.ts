import {Module} from "@nestjs/common";
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

@Module ({
    providers: [DevicesService],
    exports: [DevicesService],
    controllers: [DevicesController],
    imports: [
        NotificationModule,
        PassportModule,
        DatabaseModule,
        SequelizeModule.forFeature ([Devices, Users, Roles]),
        AuthModule,
        SocketModule
    ]
})

export class DevicesModule {
}
