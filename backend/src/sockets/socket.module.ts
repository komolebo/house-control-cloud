import {forwardRef, Module} from '@nestjs/common';
import { SocketService } from './socket.service';
import {AuthModule} from "../modules/auth/auth.module";

@Module({
  providers: [SocketService],
  exports: [SocketService],
  imports:[
      forwardRef(() => AuthModule),
  ],
})
export class SocketModule {}
