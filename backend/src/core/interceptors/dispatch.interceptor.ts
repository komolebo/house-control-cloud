import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";
import {ENDPOINT_PARAM_DEVICE_ID} from "../guards/OwnerForDevice.guard";
import {InjectModel} from "@nestjs/sequelize";
import {Devices} from "../../modules/devices/device.entity";
import {Users} from "../../modules/users/user.entity";
import {SocketService} from "../../sockets/socket.service";


@Injectable()
export class DispatchInterceptor implements NestInterceptor {
  constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
              private socketService: SocketService) {
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const deviceId: string = request.params[ENDPOINT_PARAM_DEVICE_ID];

    let device = null;
    if (deviceId) {
        device = await this.deviceRepository.findOne({
            where: {hex: deviceId.toLowerCase()},
            include: [Users]
        })
    }

    return next.handle().pipe(
        tap(res => {
          const response = context.switchToHttp().getResponse();
          const {statusCode} = response;

          if (device && device.users && statusCode === HttpStatus.CREATED) {
            device.users.forEach(conn_user => {
                this.socketService.dispatchDevUpdateMsg(conn_user.id)
            })
          }
        })
    );
  }
}
