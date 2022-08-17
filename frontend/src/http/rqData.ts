import {host} from "./index";
import {TConnectedUser, TDevRole} from "../globals/DeviceData";
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
export function fetchConnUsersByDevice(dev_id: string,
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
export function nestGetUserFullInfo(userId: number) {
    return host.get("api/users/" + userId)
}
export function nestPatchUpdateUserInfo(userId: number, data: any) {
    return host.patch("api/users/" + userId, data)
}
export function deleteSelfAccount(userId: number) {
    return host.delete("api/users/" + userId)
}


// Devices
export function nestGetDevListByUser(userId: number) {
    return host.get(`/api/devices/list/${userId}`)
}
export function nestPostReqRoleAccess(userId: number,
                                      devId: string,
                                      role: string, ) {
    return host.post(`api/devices/access/${devId}/${userId}/${role}`)
}
export function nestPostModifyAccess(userId: number,
                                     devHex: string,
                                     objUserId: number,
                                     newRole: string) {
    return host.post(`api/devices/modify/${userId}/${devHex}/${objUserId}/${newRole}`)
}
export function nestPostUnsubscribeFromDevice(userId: number, devHex: string) {
    return host.post(`api/devices/forget/${devHex}/${userId}`) // Add guard not the last
}
export function nestPostInviteUser(userId: number, devHex: string, userLogin: string, role: string) {
    return host.post(`api/devices/invite/${devHex}/${userId}/${userLogin}/${role}`)
}
export function nestPostClearDeviceUsers(userId: number, devHex: string) {
    return host.post(`api/devices/reset/${userId}/${devHex}`)
}
export function nestDeleteAccess(userId: number, devHex: string, objUserId: number) {
    return host.delete(`api/devices/${userId}/${devHex}/${objUserId}`)
}
export function nestPatchDeviceAlias(userId: number, devHex: string, alias: string) {
    return host.patch(`api/devices/alias/${devHex}/${userId}/${alias}`)
}


// Notifications
export function getNotificationsListPerUser(userId: number) {
    return host.get("api/notification/list/" + userId)
}
export function isNotificationPerUser(userId: number) {
    return host.get("api/notification/count/" + userId)
}
export function deleteNotification(userId: number, notifId: number) {
    return host.delete(`api/notification/${userId}/${notifId}`)
}


// History
export function nestPostGetHistoryPerUser(userId: number) {
    return host.get("api/history/list/" + userId)
}
export function nestDeleteUserHistory(userId: number, idArr: Array<number>) {
    // console.log("Deleting", idArr)
    return host.delete("api/history/" + userId, {
        data: {
            "id": idArr
        }
    })
}
export function nestGetCountHistoryPerUser(userId: number) {
    return host.get(`api/history/count/${userId}`)
}
export function nestGetPagingHistoryPerUser(userId: number, size: number, offset: number) {
    return host.get(`api/history/${userId}/${size}/${offset}`)
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
export function nestGetPreference(userId: number) {
    return host.get("api/user/preference/" + userId)
}
export function nestGetBlackList(userId: number) {
    return host.get("api/user/preference/black_list/" + userId)
}
export function postUnblockUser(userId: number) {
    return host.delete("api/user/preference/black_list/" + userId)
}
export function nestPatchUserPref(userId: number, pref: TUPref) {
    return host.patch("api/user/preference/" + userId, pref)
}
export function nestPostUploadAvatar(userId: number, fileForm: any) {
    return host.post("api/user/preference/avatar/" + userId, fileForm)
}
export function nestPostRemoveAvatar(userId: number) {
    return host.delete("api/user/preference/avatar/"+ userId)
}