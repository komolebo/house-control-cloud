import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevicesModule } from './modules/devices/devices.module';

@Module({
  imports: [
      DatabaseModule,
      ConfigModule.forRoot({isGlobal: true}),
      UsersModule,
      AuthModule,
      DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
