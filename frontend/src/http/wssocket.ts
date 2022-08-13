import socketio from "socket.io-client";
import {createContext} from "react";
import {getAuthToken} from "../globals/storage";

const SOCKET_URL = "http://192.168.0.109:3002"

export const socket = socketio(SOCKET_URL, {
    transportOptions: {
        polling: {
            extraHeaders: {  "Authorization": `Bearer ${getAuthToken()}` }
        },
    }
})
    // ["access_token", "3gn11Ft0Me8lkqqW2/5uFQ="]);
export const SocketContext = createContext(socket);

export const IO_NOTIFICATION_KEY = "notification"
export const IO_DEV_DATA_CHANGE_KEY = "dev_update"
