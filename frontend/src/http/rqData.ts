import {host} from "./index";
import {TConnectedUser, TDevItem, TDevRole} from "../globals/DeviceData";

export function roleStrToId(role: string) {
    switch (role) {
        case "OWNER":
            return TDevRole.OWNER;
        case "CHILD":
            return TDevRole.CHILD;
        case "GUEST":
            return TDevRole.GUEST;
        default:
            return TDevRole.ROLES_NUMBER
    }
}

export async function getDeviceList2(then: (data: any) => void) {
    let data = null;
    await host.get('auth/signup')
        .then(response =>
            data = response.data
        );
    return data;
}

export function fetchDevListByUser(id: number, onThen: (data: Array<TDevItem>) => void) {
    host.get("/api/devices/list/" + id)
        .then(resp =>{
            let devList: Array<TDevItem> = [];

            resp.data.forEach((dev: any) => {
                devList.push({
                    name: dev.name,
                    hex: dev.hex,
                    ip: dev.ip,
                    role: roleStrToId(dev.Roles.role),
                    active: dev.active,
                    id: dev.id,
                    status: 0
                })
            })
            console.log("downloaded devices", devList);
            onThen(devList)
        })
}

export function fetchConnUsersByDevice(dev_id: number,
                                       onThen: (data: Array<TConnectedUser>) => void) {
    host.get("api/users/list/" + dev_id)
        .then(resp => {
            const userList: Array<TConnectedUser> = []
            resp.data.forEach((u: any) => {
                userList.push({
                    name: u.name,
                    id: u.id,
                    role: roleStrToId(u.Roles.role)
                })
            })

            userList.sort((a, b) => a.role - b.role)
            console.log("downloaded users for device", userList);

            onThen(userList);
        })
}

export function postReqRoleAccess(dev_id: string,
                                  role: string, ) {
    return host.post("api/devices/access/" + dev_id)
        .then(resp => {
            console.log("postAccess response: ", resp)
            return resp
        })
}

export function postModifyAccess(devHex: string,
                                 userId: number,
                                 newRole: string) {
    return host.post(`api/devices/modify/${devHex}/${userId}/${newRole}`)
}

export function postUnsubscribeFromDevice(devHex: string) {
    return host.post("api/devices/forget/" + devHex)
}

export function postClearDeviceUsers(devHex: string) {
    return host.post("api/devices/abandon/" + devHex)
}

export function deleteAccess(devHex: string, userId: number) {
    return host.delete(`api/devices/${devHex}/${userId}`)
}