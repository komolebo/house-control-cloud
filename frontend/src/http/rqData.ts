import {host} from "./index";
import {TConnectedUser, TDevItem, TDevRole} from "../globals/DeviceData";
import axios from "axios";

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

export function fetchDevListByUser(id: number, onThen: (data: Array<TDevItem>) => void) {
    host.get("/api/devices/list/")
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
                    status: 0,
                    unsubscribable: dev.canUnsubscribe
                })
            })
            console.log("fetch devices per user", devList);
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
            console.log("sync users for device", userList);

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

export function postInviteUser(devHex: string, userId: number, role: string) {
    return host.post(`api/devices/invite/${devHex}/${userId}/${role}`)
}

export function postClearDeviceUsers(devHex: string) {
    return host.post("api/devices/abandon/" + devHex)
}

export function deleteAccess(devHex: string, userId: number) {
    return host.delete(`api/devices/${devHex}/${userId}`)
}


export function getNotificationsListPerUser(userId: number) {
    return host.get("api/notification/list/" + userId)
}
export function isNotificationPerUser(userId: number) {
    return host.get("api/notification/exist/" + userId)
}
export function deleteNotification(notifId: number) {
    return host.delete("api/notification/" + notifId)
}

