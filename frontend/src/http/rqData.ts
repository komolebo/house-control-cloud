import {host} from "./index";
import {TConnectedUser, TDevItem, TDevRole} from "../globals/DeviceData";
import {TUPref} from "../globals/AccountData";


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


// users
export function fetchConnUsersByDevice(dev_id: number,
                                       onThen: (data: Array<TConnectedUser>) => void) {
    host.get("api/users/list/" + dev_id)
        .then(resp => {
            const userList: Array<TConnectedUser> = []
            resp.data.forEach((u: any) => {
                userList.push({
                    fullName: u.full_name,
                    login: u.login,
                    role: roleStrToId(u.Roles.role),
                    id: u.id,
                    urlPic: u.preference ? u.preference.profile_photo : ""
                })
            })

            userList.sort((a, b) => a.role - b.role)
            console.log("sync users for device", userList);

            onThen(userList);
        })
}
export function getSelfFullInfo() {
    return host.get("api/users/me")
}
export function patchUpdateSelfInfo(data: any) {
    return host.patch("api/users/me", data)
}
export function deleteSelfAccount() {
    return host.delete("api/users/me")
}


// Devices
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
                    unsubscribable: dev.canUnsubscribe,
                    version: dev.version
                })
            })
            console.log("fetch devices per user", id, devList);
            onThen(devList)
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
export function postInviteUser(devHex: string, userLogin: string, role: string) {
    return host.post(`api/devices/invite/${devHex}/${userLogin}/${role}`)
}
export function postClearDeviceUsers(devHex: string) {
    return host.post("api/devices/abandon/" + devHex)
}
export function deleteAccess(devHex: string, userId: number) {
    return host.delete(`api/devices/${devHex}/${userId}`)
}


// Notifications
export function getNotificationsListPerUser(userId: number) {
    return host.get("api/notification/list/" + userId)
}
export function isNotificationPerUser(userId: number) {
    return host.get("api/notification/exist/" + userId)
}
export function deleteNotification(notifId: number) {
    return host.delete("api/notification/" + notifId)
}


// History
export function postGetHistoryPerUser() {
    return host.get("api/history/list/")
}
export function postDeleteHistoryPerUser(idArr: Array<number>) {
    console.log("Deleting", idArr)
    return host.delete("api/history/", {
        data: {
            "id": idArr
        }
    })
}

// Preferences
export function DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
}
export function getPreferences() {
    return host.get("api/user/preference/")
}
export function postUnblockUser(userId: number) {
    return host.delete("api/user/preference/black_list/" + userId)
}
export function postUpdateUserPref(pref: TUPref) {
    return host.patch("api/user/preference/", pref)
}
export function postUploadAvatar(fileForm: any) {
    return host.post("api/user/preference/upload/", fileForm)
}
export function postRemoveAvatar() {
    return host.delete("api/user/preference/upload/")
}
export function getBlackList() {
    return host.get("api/user/preference/black_list")
}