import {forwardRef, Module} from '@nestjs/common';
import { PreferenceController } from './preference.controller';
import {AuthModule} from "../auth/auth.module";
import {PreferenceService} from "./preference.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "../users/user.entity";
import {Preference} from "./preference.entity";
import {Blacklist} from "./blacklist.entity";
import {CloudinaryModule} from "../cloudinary/cloudinary.module";
import {UsersModule} from "../users/users.module";

@Module({
  controllers: [PreferenceController],
  providers: [PreferenceService],
  exports: [PreferenceService],
  imports: [
      forwardRef(() => AuthModule),
      forwardRef(() => UsersModule),
      SequelizeModule.forFeature([Users, Preference, Blacklist]),
      CloudinaryModule
  ]
})
export class PreferenceModule {}
