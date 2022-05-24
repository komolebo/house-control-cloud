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

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME_DEVELOPMENT,
          autoLoadModels: true,
          synchronize: true
        }),
      DatabaseModule,
      UsersModule,
      AuthModule,
      DevicesModule,
      NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
