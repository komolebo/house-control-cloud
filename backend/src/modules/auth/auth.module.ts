import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {DatabaseModule} from "../../core/database/database.module";
import {HistoryModule} from "../history/history.module";
import {DevicesModule} from "../devices/devices.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {Histories} from "../history/history.entity";
import {MailModule} from "../mail/mail.module";

@Module ({
    controllers: [AuthController],
    providers: [
        AuthService,
        // LocalStrategy,
        JwtStrategy
    ],
    exports: [JwtModule, AuthService],
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register ({
            secret: process.env.JWTKEY,
            signOptions: {expiresIn: process.env.TOKEN_EXPIRATION}
        }),
        SequelizeModule.forFeature ([Users]),
        forwardRef(() => HistoryModule),
        MailModule,
    ]
})
export class AuthModule {}
