import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Users} from "../../modules/users/user.entity";
import {AuthService} from "../../modules/auth/auth.service";
import {InjectModel} from "@nestjs/sequelize";
import {Devices} from "../../modules/devices/device.entity";
import {Roles} from "../../modules/devices/role.entity";
import {RoleValues} from "../../modules/devices/dto/roles__dto";
import {ENDPOINT_PARAM_USER_ID} from "./UserIsUser.guard";

export const ENDPOINT_PARAM_DEVICE_ID = 'device_id'

@Injectable()
export class OwnerForDeviceGuard implements CanActivate {
    constructor(@InjectModel(Devices) private readonly deviceRepository: typeof Devices,
                // private readonly deviceService: DevicesService,
                private authService: AuthService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userId: number = request.params[ENDPOINT_PARAM_USER_ID];
        let deviceId: string = request.params[ENDPOINT_PARAM_DEVICE_ID];
        deviceId = deviceId.toLowerCase()

        return userId && deviceId && this.deviceRepository.findOne({
            where : {hex: deviceId},
            include: [{
                model: Users,
                where: {
                    id: userId
                }
            }]
        })
            .then((device: Devices) => {
                let isOwner = false;

                if(device && device.users.length) {
                    const user = device.users[0]
                    isOwner = user.get("Roles")["dataValues"].role === RoleValues.Owner
                }

                return isOwner;
            })
    }
}