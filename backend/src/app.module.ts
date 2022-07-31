import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevicesModule } from './modules/devices/devices.module';
import {SequelizeModule} from "@nestjs/sequelize";
import { NotificationModule } from './modules/notification/notification.module';
import {HistoryModule} from "./modules/history/history.module";
import {PreferenceModule} from "./modules/preference/preference.module";
import {SocketModule} from "./sockets/socket.module";


@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
          isGlobal: true
      }),
      SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME_TEST,
        }),
      DatabaseModule,
      UsersModule,
      PreferenceModule,
      AuthModule,
      DevicesModule,
      NotificationModule,
      HistoryModule,
      SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

