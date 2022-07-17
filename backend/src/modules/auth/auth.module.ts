import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {DatabaseModule} from "../../core/database/database.module";
import {HistoryModule} from "../history/history.module";

@Module ({
    imports: [
        DatabaseModule,
        PassportModule,
        UsersModule,
        JwtModule.register ({
            secret: process.env.JWTKEY,
            signOptions: {expiresIn: process.env.TOKEN_EXPIRATION}
        }),
        forwardRef(() => HistoryModule)
    ],
    providers: [
        AuthService,
        // LocalStrategy,
        JwtStrategy
    ],
    controllers: [AuthController],
    exports: [JwtModule]
})
export class AuthModule {}
