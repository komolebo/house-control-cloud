import axios from "axios";
import {getAuthToken} from "../globals/UserAuthProvider";

const BACKEND_API_URL = "http://192.168.0.109:3000/"

export const host = axios.create({
    baseURL: BACKEND_API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json', //
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    },
})

export function updateTokenInHostHeaders() {
    const authToken = getAuthToken();

    if (authToken === null) {
        // This means that there ISN'T JWT and no user is logged in.
        host.defaults.headers.common.Authorization = false;
    } else {
        // This means that there IS a JWT so someone must be logged in.
        host.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    }
}