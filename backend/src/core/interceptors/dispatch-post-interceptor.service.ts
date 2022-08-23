import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";
import {ENDPOINT_PARAM_DEVICE_ID} from "../guards/OwnerForDevice.guard";
import {InjectModel} from "@nestjs/sequelize";
import {Devices} from "../../modules/devices/device.entity";
import {Users} from "../../modules/users/user.entity";
import {SocketService} from "../../sockets/socket.service";


@Injectable()
export class DispatchPostInterceptor implements NestInterceptor {
  constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
              private socketService: SocketService) {
  }

  private isStatusOk(status: HttpStatus) {
    return status === HttpStatus.CREATED || status === HttpStatus.OK
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const deviceId: string = request.params[ENDPOINT_PARAM_DEVICE_ID];

    return next.handle ().pipe (
        tap (res => {
            if(!deviceId) return;

            this.deviceRepository.findOne ({
                where: {hex: deviceId.toLowerCase ()},
                include: [Users]
            }).then(device => {
                if(!device.users) return;

                const response = context.switchToHttp().getResponse ();
                const {statusCode} = response;

                if (this.isStatusOk(statusCode) && device && device.users) {
                    const dispatchList = device.users.map (el => el.id);

                    dispatchList.forEach (conn_user => {
                        this.socketService.dispatchDevUpdateMsg ([conn_user]);
                    })
                }
            })
        })
    );
  }
}
