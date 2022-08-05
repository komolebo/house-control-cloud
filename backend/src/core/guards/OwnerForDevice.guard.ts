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
                private authService: AuthService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        let userId = this.getUserId (request);
        let deviceId = this.getDeviceId(request);

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

    private getDeviceId(request) {
        let deviceId: string = request.params[ENDPOINT_PARAM_DEVICE_ID];
        deviceId = deviceId ? deviceId.toLowerCase () : deviceId;
        return deviceId;
    }

    private getUserId(request) {
        let userId: number = request.params[ENDPOINT_PARAM_USER_ID];
        if (userId === undefined) {// not specified in params, look for in tokens
            return this.authService.parseHeaders (request.headers.authorization).id
        }
        return userId;
    }
}