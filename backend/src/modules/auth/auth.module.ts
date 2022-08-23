import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {DatabaseModule} from "../../core/database/database.module";
import {HistoryModule} from "../history/history.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {MailModule} from "../mail/mail.module";
import {Auth} from "./auth.entity";

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
        SequelizeModule.forFeature ([Users, Auth]),
        forwardRef(() => HistoryModule),
        MailModule,
    ]
})
export class AuthModule {}
